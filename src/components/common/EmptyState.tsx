import type { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  illustration?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  icon,
  illustration,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-card)] border border-dashed border-text/15 bg-surface p-6 text-center sm:p-10">
      {illustration && <div className="mb-4">{illustration}</div>}

      {icon && <div className="mb-4 text-primary">{icon}</div>}

      <h3 className="text-xl font-semibold text-text">{title}</h3>

      {description && (
        <p className="mt-2 max-w-sm text-text-muted">{description}</p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
