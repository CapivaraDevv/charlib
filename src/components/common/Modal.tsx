import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

interface ModalProps {
  open: boolean;
  title?: ReactNode;
  children: ReactNode;
  onClose: () => void;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  open,
  title,
  children,
  onClose,
  className,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "w-full rounded-2xl bg-surface p-6 shadow-xl",
          sizes[size],
          className,
        )}
      >
        <div className="mb-2 flex items-center justify-between">
          {title && (
            <h2 className="font-display text-2xl font-bold">{title}</h2>
          )}

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-surface-hover"
          >
            <X size={22} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
