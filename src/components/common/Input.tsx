

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  className = "",
  ...props
}: InputProps) {
  return (
    <input
      className={`
        w-full
        rounded-xl
        border
        border-white/10
        bg-background
        px-4
        py-3
        text-foreground
        outline-none
        transition-colors
        placeholder:text-text-muted
        focus:border-primary

        ${className}
      `}
      {...props}
    />
  );
}