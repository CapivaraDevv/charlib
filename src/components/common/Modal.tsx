import type { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  children: ReactNode;
  title?: string;
  onClose: () => void;
  className?: string;
}

export default function Modal({
  open,
  children,
  title,
  onClose,
  className = "",
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className={`
          w-full
          max-w-lg
          rounded-2xl
          bg-surface
          p-6
          shadow-xl
          ${className}
        `}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h2 className="font-display text-2xl font-bold">
              {title}
            </h2>
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