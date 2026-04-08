interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "error" | "new" | "pro";
  onClick?: () => void;
}

export default function Badge({ 
  children, 
  className = "", 
  variant = "default",
  onClick
}: BadgeProps) {
  const variantClasses = {
    default: "bg-zinc-400 text-black hover:bg-zinc-300",
    success: "bg-green-500 text-white hover:bg-green-600",
    warning: "bg-yellow-500 text-black hover:bg-yellow-600",
    error: "bg-red-500 text-white hover:bg-red-600",
    new: "bg-blue-500 text-white hover:bg-blue-600",
    pro: "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
  };

  const cursorClass = onClick ? "cursor-pointer" : "";

  return (
    <span 
      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${variantClasses[variant]} ${cursorClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
