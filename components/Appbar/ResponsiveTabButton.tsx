import React from "react";
import { LucideIcon } from "lucide-react";

interface ResponsiveTabButtonProps {
  value: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const ResponsiveTabButton: React.FC<ResponsiveTabButtonProps> = ({
  value,
  icon: Icon,
  label,
  isActive,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-2 h-full w-full rounded-sm transition-colors ${
      isActive ? "bg-white text-gray-800" : "text-white hover:bg-white/10"
    }`}
  >
    <Icon size={18} className="sm:mr-2" />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

export default ResponsiveTabButton;
