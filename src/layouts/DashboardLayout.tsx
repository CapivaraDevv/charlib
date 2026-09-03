import type { ReactNode } from "react";
import Sidebar from "../components/layout/Sidebar";

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text md:h-screen md:flex-row md:overflow-hidden">
      <div className="border-b border-text/10 md:hidden">
        <Sidebar mobile />
      </div>

      <aside className="hidden h-full w-64 shrink-0 border-r border-text/10 md:block">
        <Sidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

