export type StateEntry = { value: string | null; revision: number; pending: boolean };
export type StateCache = Record<string, StateEntry>;
let account: string | null = null;
const listeners = new Set<() => void>();

export function subscribeStorage(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function storageAccount() { return account; }
export function setStorageAccount(userId: string | null) { account = userId; }
export function readAccountCache(userId: string): StateCache {
  const raw = localStorage.getItem(`charlib:account:${userId}:state`);
  return raw ? JSON.parse(raw) as StateCache : {};
}
export function saveAccountCache(userId: string, cache: StateCache) {
  localStorage.setItem(`charlib:account:${userId}:state`, JSON.stringify(cache));
}
function write(key: string, value: string | null) {
  if (!account) {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
    return;
  }
  const cache = readAccountCache(account);
  if (cache[key]?.value === value) return;
  cache[key] = { value, revision: cache[key]?.revision ?? 0, pending: true };
  saveAccountCache(account, cache);
  listeners.forEach(listener => listener());
}
export const accountStorage = {
  getItem(key: string): string | null {
    return account ? readAccountCache(account)[key]?.value ?? null : localStorage.getItem(key);
  },
  setItem(key: string, value: string) { write(key, value); },
  removeItem(key: string) { write(key, null); },
};
