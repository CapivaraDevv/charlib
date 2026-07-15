import type { ReactNode } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

type Props = {
  children: ReactNode;
};

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex h-screen bg-[#5B3E2B] text-white">
      <aside className="h-full w-64 border-r border-white/10">
        <Sidebar />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="h-20 border-b border-white/10 bg-[#4A3225]">
          <Header />
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}