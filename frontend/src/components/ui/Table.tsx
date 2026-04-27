import { cn } from "../../lib/utils";
import type { ReactNode } from "react";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export function Table({ children, className, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("min-w-full divide-y divide-border", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn("bg-sidebar", className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("divide-y divide-border bg-card", className)}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn("hover:bg-sidebar transition-all duration-200", className)}>
      {children}
    </tr>
  );
}

export function TableHeader({ children, className }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-6 py-3 text-left text-xs font-medium text-textSecondary uppercase tracking-wider",
        className
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-6 py-4 whitespace-nowrap text-sm text-textPrimary", className)}>
      {children}
    </td>
  );
}
