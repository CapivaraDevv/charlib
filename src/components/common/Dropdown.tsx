import { useEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";

export interface DropdownItem {
  id: string;
  label: ReactNode;
  onClick: () => void;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  className?: string;
}

export default function Dropdown({ trigger, items, className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClickOutside);

    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative z-30 inline-block">
      <div onClick={() => setOpen((prev) => !prev)}>{trigger}</div>

      {open && (
        <div
          className={clsx(
            "absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-text/10 bg-surface text-text shadow-xl",
            className,
          )}
        >
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className="w-full px-4 py-3 text-left transition-colors hover:bg-surface-hover"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
