import type { ReactNode } from "react";
import Sidebar from "../components/layout/Sidebar";

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex h-screen bg-background text-text">
      <aside className="h-full w-64 border-r border-text/10">
        <Sidebar />
      </aside>

      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

