interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-black border border-white/10 rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
}
