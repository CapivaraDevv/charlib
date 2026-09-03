import type { ReactNode } from "react";

import Card from "../common/Card";
import ProgressBar from "../common/ProgressBar";

type StatsCardProps = {
  title: string;

  value: string;

  subtitle?: string;

  icon: ReactNode;

  progress?: number;

  tone?: "warm" | "primary" | "cool";
};

export default function StatsCard({
  title,

  value,

  subtitle,

  icon,

  progress,

  tone = "primary",
}: StatsCardProps) {
  const toneClasses = {
    warm: "bg-amber-400/10 text-amber-300",
    primary: "bg-primary/15 text-primary",
    cool: "bg-sky-400/10 text-sky-300",
  };

  return (
    <Card className="flex items-center gap-4 border border-text/10 p-4 shadow-sm transition-colors hover:border-text/20 sm:p-5">
      <div className={`rounded-2xl p-3 ${toneClasses[tone]}`}>{icon}</div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-text-muted">{title}</p>

        <h3 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
          {value}
        </h3>

        {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}

        {progress !== undefined && (
          <div className="mt-3 flex items-center gap-2">
            <ProgressBar value={progress} className="flex-1" />
            <span className="text-xs font-medium tabular-nums text-text-muted">
              {progress}%
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
