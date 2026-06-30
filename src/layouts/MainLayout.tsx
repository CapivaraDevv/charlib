import type { ReactNode } from "react";

interface Props {
    children: ReactNode
}

export default function MainLayout({children}: Props){
    return(
        <main className="min-h-screen bg-[#5B3E2B] text-white">
            {children}
        </main>
    )
}