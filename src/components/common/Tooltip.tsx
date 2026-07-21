import { useState, type ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
}

export default function Tooltip({
  children,
  content,
}: TooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}

      {open && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-lg bg-surface px-3 py-2 text-sm shadow-lg whitespace-nowrap">
          {content}
        </div>
      )}
    </div>
  );
}