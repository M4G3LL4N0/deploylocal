interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "error";
}

export default function Badge({ 
  children, 
  className = "", 
  variant = "default" 
}: BadgeProps) {
  const variantClasses = {
    default: "bg-zinc-400 text-black",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-black",
    error: "bg-red-500 text-white",
  };

  return (
    <span className={`px-3 py-1 rounded text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
