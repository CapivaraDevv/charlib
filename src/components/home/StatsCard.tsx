import type { ReactNode } from "react";
import Card from "../common/Card";

type StatsCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
}: StatsCardProps) {
  return (
    <Card className="flex items-center gap-4 p-6">
      <div className="rounded-xl bg-surface-hover p-3 text-primary">{icon}</div>

      <div>
        <p className="text-sm text-text-muted">{title}</p>

        <h3 className="text-3xl font-bold text-text">{value}</h3>

        {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
      </div>
    </Card>
  );
}
