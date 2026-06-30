import type { ReactNode } from "react";
import clsx from "clsx"

interface CardProps {
    children: ReactNode
    classname?: string
}

export default function Card({children, classname}: CardProps){
    return(
        <div className={clsx("rounded-3xl bg-[#654331]", classname)}>
            {children}
        </div>
    )
}