import { useState, useSyncExternalStore } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getSyncStatus, subscribeSync, flushState, resolveStateConflict } from "../../services/stateSync";
import { migrateLocalLibrary } from "../../services/migrateLocal";
import { useLibrary } from "../../hooks/useLibrary";
import Modal from "./Modal";
import Button from "./Button";

export default function AccountPanel() {
  const { session, configured, signOut, showLogin } = useAuth();
  const { reloadBooks } = useLibrary();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const sync = useSyncExternalStore(subscribeSync, getSyncStatus);
  async function run(action: () => Promise<void>) {
    setBusy(true); setFailed(false); setMessage("");
    try { await action(); } catch (cause) { setFailed(true); setMessage(cause instanceof Error ? cause.message : "Não foi possível concluir. Tente novamente."); }
    finally { setBusy(false); }
  }
  if (!configured) return null;
  return <>
    <button type="button" className="rounded-lg border border-text/20 px-3 py-2 text-sm text-primary" onClick={() => session ? setOpen(true) : showLogin()}>
      {session ? sync.pending ? "Conta · envio pendente" : "Minha conta" : "Entrar / criar conta"}
    </button>
    {session && <Modal open={open} title="Minha conta" onClose={() => { if (!busy) setOpen(false); }}>
      <p className="break-all text-text-muted">{session.user.email}</p>
      <p role="status" className="mt-3 text-sm">{sync.message || "Dados desta conta na nuvem."}</p>
      {sync.conflict && <div className="mt-4 flex flex-wrap gap-2">
        <Button disabled={busy} onClick={() => { void run(async () => { await resolveStateConflict(true); }); }}>Manter este dispositivo</Button>
        <Button disabled={busy} variant="outline" onClick={() => { void run(async () => { await resolveStateConflict(false); window.location.reload(); }); }}>Usar versão da nuvem</Button>
      </div>}
      <div className="mt-6 rounded-xl border border-text/10 p-4">
        <h3 className="font-semibold">Trazer minha biblioteca local</h3>
        <p className="mt-2 text-sm text-text-muted">Copie os livros, notas, marcadores, metas e histórico salvos neste navegador para esta conta. Faça isso somente se esses dados forem seus. Os originais não serão apagados.</p>
        <Button className="mt-4" disabled={busy} onClick={() => { void run(async () => { await migrateLocalLibrary(setMessage); await reloadBooks(); }); }}>Importar dados deste navegador</Button>
      </div>
      {message && <p role={failed ? "alert" : "status"} className={`mt-4 text-sm ${failed ? "text-red-300" : "text-primary"}`}>{message}</p>}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button disabled={busy} onClick={() => { void run(async () => { await flushState(); if (getSyncStatus().pending) throw new Error("Ainda há dados pendentes. Verifique a conexão ou resolva o conflito."); window.location.reload(); }); }}>Sincronizar e atualizar</Button>
        <Button disabled={busy} variant="outline" onClick={() => { void run(signOut); }}>Sair da conta</Button>
      </div>
      <p className="mt-3 text-xs text-text-muted">Alterações pendentes ficam neste navegador, associadas à sua conta, e são reenviadas ao entrar novamente.</p>
    </Modal>}
  </>;
}
