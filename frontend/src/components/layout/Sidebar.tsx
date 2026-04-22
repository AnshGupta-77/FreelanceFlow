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
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
        isActive
          ? "bg-indigo-50 text-indigo-600"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md lg:hidden"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-200 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-200">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">FreeLanceFlow</span>
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
          <div className="px-6 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              © 2024 FreeLanceFlow
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
