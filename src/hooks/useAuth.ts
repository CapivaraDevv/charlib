import { createContext, useContext } from "react";
import type { Session } from "@supabase/supabase-js";

export const AuthContext = createContext<{
  session: Session | null;
  configured: boolean;
  signOut: () => Promise<void>;
  showLogin: () => void;
}>({ session: null, configured: false, signOut: async () => {}, showLogin: () => {} });
export function useAuth() { return useContext(AuthContext); }
