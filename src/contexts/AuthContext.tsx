import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../services/supabase";
import { AuthContext } from "../hooks/useAuth";
import { setStorageAccount, storageAccount, subscribeStorage } from "../services/accountStorage";
import { flushState, hydrateState, resetSyncStatus } from "../services/stateSync";
import Auth from "../pages/Auth";
import LibraryLoadingScreen from "../components/common/LibraryLoadingScreen";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(!!supabase);
  const [localMode, setLocalMode] = useState(() => !supabase || sessionStorage.getItem("charlib:local-mode") === "1");
  const [readyUser, setReadyUser] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [recovery, setRecovery] = useState(false);
  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, next) => {
      if (next?.user.id !== storageAccount()) setError("");
      if (event === "SIGNED_IN" && next?.user.id !== storageAccount()) {
        // A different account must not land on the previous account's book URL.
        window.history.replaceState(null, "", "/");
      }
      setStorageAccount(next?.user.id ?? null);
      setSession(next); setLoading(false);
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      if (!next) { setReadyUser(null); resetSyncStatus(); }
      if (event === "SIGNED_OUT") { setLocalMode(false); sessionStorage.removeItem("charlib:local-mode"); }
    });
    return () => subscription.unsubscribe();
  }, []);
  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    setStorageAccount(userId);
    hydrateState(userId).then(() => {
      if (!cancelled && storageAccount() === userId) { setError(""); setReadyUser(userId); void flushState(); }
    }).catch(() => { if (!cancelled) setError("Não foi possível carregar sua biblioteca."); });
    return () => { cancelled = true; };
  }, [userId, attempt]);
  useEffect(() => {
    if (!userId || readyUser !== userId) return;
    const sync = () => { void flushState(); };
    const unsubscribe = subscribeStorage(sync);
    window.addEventListener("online", sync);
    const timer = window.setInterval(sync, 15000);
    return () => { unsubscribe(); clearInterval(timer); window.removeEventListener("online", sync); };
  }, [userId, readyUser]);
  async function signOut() {
    await flushState();
    const { error } = await supabase!.auth.signOut({ scope: "local" });
    if (error) throw new Error("Não foi possível sair. Tente novamente.");
    setLocalMode(false); setRecovery(false);
  }
  function retryLibrary() {
    setError("");
    setAttempt(n => n + 1);
  }
  async function exitLoadingScreen() {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch {
      setError("Não foi possível sair. Tente novamente.");
    } finally {
      setIsSigningOut(false);
    }
  }
  if (loading) return <LibraryLoadingScreen message="Carregando sua conta…" />;
  if (recovery || (!session && !localMode)) return <Auth key={String(recovery)} recovery={recovery} onLocal={() => { setStorageAccount(null); sessionStorage.setItem("charlib:local-mode", "1"); setLocalMode(true); }} onRecovered={() => setRecovery(false)} />;
  if (userId && readyUser !== userId) return (
    <LibraryLoadingScreen
      error={error}
      isSigningOut={isSigningOut}
      onRetry={retryLibrary}
      onSignOut={() => { void exitLoadingScreen(); }}
    />
  );
  return <AuthContext.Provider value={{ session, configured: !!supabase, signOut, showLogin: () => { sessionStorage.removeItem("charlib:local-mode"); setLocalMode(false); } }}><div key={userId ?? "local"}>{children}</div></AuthContext.Provider>;
}
