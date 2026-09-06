import { useState, type FormEvent } from "react";
import { requireSupabase } from "../services/supabase";
import Logo from "../assets/Logo.png";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

type Mode = "login" | "signup" | "forgot" | "recovery";
export default function Auth({ recovery = false, onLocal, onRecovered }: {
  recovery?: boolean; onLocal: () => void; onRecovered: () => void;
}) {
  const [mode, setMode] = useState<Mode>(recovery ? "recovery" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  function switchMode(next: Mode) { setMode(next); setError(""); setMessage(""); setPassword(""); }
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage(""); setError("");
    try {
      const client = requireSupabase();
      const redirectTo = `${window.location.origin}/`;
      if (mode === "login") {
        const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw new Error("Não foi possível entrar. Confira o e-mail, a senha e a confirmação do cadastro.");
      } else if (mode === "signup") {
        const { error } = await client.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: redirectTo } });
        if (error) throw new Error("Não foi possível criar a conta. Tente novamente em alguns minutos.");
        setMessage("Confira seu e-mail para confirmar o cadastro. Depois, entre com sua senha.");
        setPassword("");
      } else if (mode === "forgot") {
        const { error } = await client.auth.resetPasswordForEmail(email.trim(), { redirectTo });
        if (error) throw new Error("Não foi possível solicitar a recuperação. Tente novamente em alguns minutos.");
        setMessage("Se houver uma conta para esse e-mail, você receberá um link para redefinir a senha.");
      } else {
        const { error } = await client.auth.updateUser({ password });
        if (error) throw new Error("Não foi possível atualizar a senha. Solicite um novo link ou tente outra senha.");
        setPassword(""); onRecovered();
      }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Não foi possível conectar. Tente novamente."); }
    finally { setBusy(false); }
  }
  const title = { login: "Sua biblioteca, com você", signup: "Crie sua conta", forgot: "Recuperar senha", recovery: "Escolha uma nova senha" }[mode];
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background p-4 text-text">
      <section className="w-full max-w-md rounded-2xl border border-text/10 bg-surface p-6 shadow-xl sm:p-8">
        <img src={Logo} alt="CharLib" className="mx-auto h-24 w-32 object-contain" />
        <h1 className="mt-4 text-center font-display text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-center text-sm text-text-muted">Acesse seus livros, notas e progresso em outros dispositivos.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode !== "recovery" && <div><label htmlFor="auth-email">E-mail</label><Input id="auth-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></div>}
          {mode !== "forgot" && <div><label htmlFor="auth-password">Senha{mode !== "login" ? " (mínimo 8 caracteres)" : ""}</label><Input id="auth-password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={mode === "login" ? 1 : 8} value={password} onChange={e => setPassword(e.target.value)} /></div>}
          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
          {message && <p role="status" className="text-sm text-primary">{message}</p>}
          <Button type="submit" disabled={busy} className="w-full">{busy ? "Aguarde..." : { login: "Entrar", signup: "Criar conta", forgot: "Enviar link", recovery: "Salvar nova senha" }[mode]}</Button>
        </form>
        {!recovery && <div className="mt-5 flex flex-col gap-3 text-center text-sm">
          <button disabled={busy} className="text-primary" onClick={() => switchMode(mode === "signup" ? "login" : "signup")}>{mode === "signup" ? "Já tenho uma conta" : "Criar uma conta"}</button>
          <button disabled={busy} className="text-text-muted" onClick={() => switchMode(mode === "forgot" ? "login" : "forgot")}>{mode === "forgot" ? "Voltar para entrar" : "Esqueci minha senha"}</button>
          <button disabled={busy} className="mt-3 border-t border-text/10 pt-4 text-text-muted" onClick={onLocal}>Continuar apenas neste navegador</button>
        </div>}
      </section>
    </main>
  );
}
