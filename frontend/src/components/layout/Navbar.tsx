import { Bell, User, LogOut } from "lucide-react";
import { Button } from "../ui/Button";
import { useState } from "react";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [notifications] = useState(3);

  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Left side - spacer for mobile menu */}
        <div className="w-10 lg:hidden" />

        {/* Right side - actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <button className="relative p-2 text-textSecondary hover:text-textPrimary transition-all duration-300 rounded-xl hover:bg-sidebar">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-error rounded-full text-xs text-white flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* Profile dropdown */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-textPrimary">John Doe</p>
              <p className="text-xs text-textSecondary">Freelancer</p>
            </div>
          </div>

          {/* Logout */}
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
