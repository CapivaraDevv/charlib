import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: `
      border border-primary
      bg-primary
      text-surface
      hover:opacity-90
    `,
    outline: `
      border border-primary
      bg-transparent
      text-primary
      hover:bg-primary/10
    `,
    ghost: `
      bg-transparent
      text-foreground
      hover:bg-white/5
    `,
  };

  return (
    <button
      className={`
        w-full
        rounded-lg
        px-5
        py-3
        font-medium
        transition-colors
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
} 