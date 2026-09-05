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
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}

      {open && (
        <div role="tooltip" className="pointer-events-none absolute top-full left-1/2 mt-2 w-max max-w-32 -translate-x-1/2 rounded-lg bg-surface px-3 py-2 text-center text-sm shadow-lg">
          {content}
        </div>
      )}
    </div>
  );
}
