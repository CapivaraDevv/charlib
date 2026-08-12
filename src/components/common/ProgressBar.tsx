
type ProgressBarProps = {
  value: number;
  className?: string;
};

export default function ProgressBar({ value, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`h-2.5 overflow-hidden rounded-full bg-surface-hover/70 ${className ?? ""}`}>
      <div
        className="h-full rounded-full bg-primary transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
