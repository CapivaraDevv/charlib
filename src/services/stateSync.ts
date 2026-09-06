import { requireSupabase } from "./supabase";
import { readAccountCache, saveAccountCache, storageAccount, type StateEntry } from "./accountStorage";

let running: Promise<void> | null = null;
export type SyncStatus = { message: string; conflict: string | null; pending: number };
let status: SyncStatus = { message: "", conflict: null, pending: 0 };
const listeners = new Set<() => void>();
export function getSyncStatus() { return status; }
export function subscribeSync(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function notify(next: SyncStatus) { status = next; listeners.forEach(fn => fn()); }
export function resetSyncStatus() { notify({ message: "", conflict: null, pending: 0 }); }
export async function hydrateState(userId: string) {
  const client = requireSupabase();
  const cache = readAccountCache(userId);
  const next: Record<string, StateEntry> = {};
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await client.from("user_state").select("key,value,revision").eq("user_id", userId).order("key").range(offset, offset + 499);
    if (error) throw new Error("Não foi possível carregar seus dados. Confira a conexão e se a configuração SQL do CharLib foi executada.");
    for (const row of data) next[row.key] = { value: row.value, revision: row.revision, pending: false };
    if (data.length < 500) break;
  }
  // Do not rebase pending local changes: CAS must detect remote changes.
  for (const [key, entry] of Object.entries(cache)) if (entry.pending) next[key] = entry;
  saveAccountCache(userId, next);
}
export async function flushState(): Promise<void> {
  if (running) return running;
  const userId = storageAccount();
  if (!userId) return;
  running = Promise.resolve().then(async () => {
    try {
      while (storageAccount() === userId) {
        const pending = Object.entries(readAccountCache(userId)).filter(([, entry]) => entry.pending);
        if (!pending.length) { notify({ message: "Sincronizado", conflict: null, pending: 0 }); return; }
        const [key, entry] = pending[0];
        const { data, error } = await requireSupabase().rpc("save_user_state", {
          state_key: key, state_value: entry.value, expected_revision: entry.revision,
        });
        if (storageAccount() !== userId) return;
        if (error) {
          const conflict = error.message.includes("CHARLIB_CONFLICT") ? key : null;
          notify({ message: conflict ? "Há alterações diferentes em outro dispositivo. Escolha qual versão manter." : "Alterações salvas neste navegador; aguardando envio à nuvem.", conflict, pending: pending.length });
          return;
        }
        const latest = readAccountCache(userId);
        latest[key] = { ...latest[key], revision: Number(data), pending: latest[key]?.value !== entry.value };
        saveAccountCache(userId, latest);
      }
    } catch {
      if (storageAccount() === userId) notify({ message: "Não foi possível sincronizar. Seus dados locais foram mantidos.", conflict: null, pending: 1 });
    }
  }).finally(() => { running = null; });
  return running;
}
export async function resolveStateConflict(preferLocal: boolean) {
  const userId = storageAccount();
  const key = status.conflict;
  if (!userId || !key) return;
  const { data, error } = await requireSupabase().from("user_state").select("value,revision").eq("user_id", userId).eq("key", key).single();
  if (error) throw error;
  if (storageAccount() !== userId) return;
  const cache = readAccountCache(userId);
  // Keep a recoverable copy of both versions before applying the user's choice.
  localStorage.setItem(`charlib:conflict:${userId}:${Date.now()}`, JSON.stringify({ key, local: cache[key], remote: data }));
  cache[key] = { value: preferLocal ? cache[key].value : data.value, revision: data.revision, pending: preferLocal };
  saveAccountCache(userId, cache);
  resetSyncStatus();
  await flushState();
}
