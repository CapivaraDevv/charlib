import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost" | "danger";
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
      text-background
      hover:bg-primary-hover
    `,
    outline: `
      border border-primary
      bg-transparent
      text-primary
      hover:bg-primary/10
    `,
    ghost: `
      bg-transparent
      text-text
      hover:bg-surface-hover
    `,
    danger: `
      bg-red-500
      text-text
      hover:opacity-90
    `,
  };

  return (
    <button
      className={`
        cursor-pointer
        rounded-lg
        px-5
        py-3
        font-medium
        transition-colors
        disabled:cursor-not-allowed
        disabled:opacity-50

        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
