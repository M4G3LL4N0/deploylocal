import {ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  type?: "submit" | "button" | "reset";
  onClick?: () => void;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
  onClick,
}: ButtonProps) {
  const baseClasses = "disabled:opacity-50 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20";

  const variantClasses = {
    primary: "bg-white text-black hover:bg-black/5",
    secondary: "bg-black/20 text-white hover:bg-black/30",
    outline: "border border-white/10 text-white hover:bg-white/5",
  }[variant];

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }[size];

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} rounded-lg font-medium ${className}`}
    >
      {children}
    </button>
  );
}
