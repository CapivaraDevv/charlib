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
    <Card classname="flex items-center gap-4 p-6">
      <div className="rounded-xl bg-[#8A5A44] p-3">
        {icon}
      </div>

      <div>
        <p className="text-sm text-white/70">
          {title}
        </p>

        <h3 className="text-3xl font-bold">
          {value}
        </h3>

        {subtitle && (
          <p className="text-sm text-white/60">
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
}