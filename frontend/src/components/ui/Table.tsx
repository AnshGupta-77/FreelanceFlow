import { cn } from "../../lib/utils";
import type { ReactNode } from "react";

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export function Table({ children, className, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("min-w-full divide-y divide-gray-200", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children, className }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn("bg-gray-50", className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("divide-y divide-gray-200 bg-white", className)}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn("hover:bg-gray-50 transition-colors", className)}>
      {children}
    </tr>
  );
}

export function TableHeader({ children, className }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
        className
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({ children, className }: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-6 py-4 whitespace-nowrap text-sm text-gray-900", className)}>
      {children}
    </td>
  );
}
