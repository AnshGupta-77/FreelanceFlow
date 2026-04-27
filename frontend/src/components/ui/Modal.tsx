import { cn } from "../../lib/utils";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg";
}

export function Modal({ isOpen, onClose, children, title, size = "md" }: ModalProps) {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          className="fixed inset-0 bg-bg/80 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        <div
          className={cn(
            "relative transform overflow-hidden rounded-xl bg-card text-left shadow-xl shadow-black/50 transition-all w-full border border-border",
            sizes[size]
          )}
        >
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold text-textPrimary">{title}</h3>
              <button
                onClick={onClose}
                className="text-textSecondary hover:text-textPrimary transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          <div className="px-6 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
