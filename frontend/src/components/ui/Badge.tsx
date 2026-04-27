import { cn } from "../../lib/utils";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ children, variant = "default", className, ...props }: BadgeProps) {
  const variants = {
    default: "bg-sidebar text-textSecondary",
    primary: "bg-primary/20 text-primary",
    success: "bg-accentGreen/20 text-accentGreen",
    warning: "bg-yellow-500/20 text-yellow-400",
    danger: "bg-error/20 text-error",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
