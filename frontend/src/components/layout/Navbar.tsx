import { Bell, User, LogOut } from "lucide-react";
import { Button } from "../ui/Button";
import { useState } from "react";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [notifications, setNotifications] = useState(3);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Left side - spacer for mobile menu */}
        <div className="w-10 lg:hidden" />

        {/* Right side - actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-lg hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>

          {/* Profile dropdown */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Freelancer</p>
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
