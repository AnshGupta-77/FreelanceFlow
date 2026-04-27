import { cn } from "../../lib/utils";
import { LayoutDashboard, Users, Briefcase, Calendar, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ to, icon, label, isActive }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
        isActive
          ? "bg-primary/20 text-primary shadow-glow-sm"
          : "text-textSecondary hover:bg-card hover:text-textPrimary"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard" },
    { to: "/clients", icon: <Users className="h-5 w-5" />, label: "Clients" },
    { to: "/projects", icon: <Briefcase className="h-5 w-5" />, label: "Projects" },
    { to: "/schedule", icon: <Calendar className="h-5 w-5" />, label: "Schedule" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-bg/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-card border border-border shadow-md lg:hidden"
      >
        {isOpen ? <X className="h-5 w-5 text-textPrimary" /> : <Menu className="h-5 w-5 text-textPrimary" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-sidebar border-r border-border transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-glow-sm">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-xl font-bold text-textPrimary">FreeLanceFlow</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.to}
              />
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border">
            <p className="text-xs text-textMuted">
              © 2024 FreeLanceFlow
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
