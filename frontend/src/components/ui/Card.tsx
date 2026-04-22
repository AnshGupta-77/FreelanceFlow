import { cn } from "../../lib/utils";
import type { ReactNode } from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export function Card({ children, className, hover = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-gray-200 shadow-sm transition-all duration-200",
        hover && "hover:-translate-y-0.5 hover:shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-4 border-b border-gray-100", className)}>{children}</div>;
}

export function CardTitle({ children, className }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold text-gray-900", className)}>{children}</h3>;
}

export function CardDescription({ children, className }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-gray-500 mt-1", className)}>{children}</p>;
}

export function CardContent({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}

export function CardFooter({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-4 border-t border-gray-100", className)}>{children}</div>;
}
