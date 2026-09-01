import type { ReactNode } from "react";
import Sidebar from "../components/layout/Sidebar";

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-text">
      <aside className="h-full w-64 shrink-0 border-r border-text/10">
        <Sidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

