import React from "react";
import { VleProfile } from "../types";
import {
  Menu,
  PlusCircle,
  Settings,
  Languages,
  Printer,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface HeaderProps {
  vle: VleProfile;
  lang: "hi" | "en";
  setLang: (lang: "hi" | "en") => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewToken: () => void;
  onOpenSettings: () => void;
  onOpenDayEnd: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  vle,
  lang,
  setLang,
  onOpenNewToken,
  onOpenSettings,
  onOpenDayEnd,
  onToggleMobileMenu,
}) => {
  // Get initials for operator avatar
  const getInitials = (name: string) => {
    if (!name) return "OP";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0 sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Toggle & Location */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            id="mobile-menu-toggle-btn"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-gray-500 font-medium">Location:</span>
          <span className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
            {vle.centerName || "CSC Kendra"}, {vle.district || "Delhi"}
          </span>
        </div>
      </div>

      {/* Right: Status Pill, Language Toggle, Quick Actions & Profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Portal Online Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-700 bg-gray-100/90 border border-gray-200 px-3 py-1 rounded-full font-medium shadow-2xs">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>Portal Online</span>
        </div>

        {/* Language Switch */}
        <button
          id="header-lang-toggle"
          onClick={() => setLang(lang === "hi" ? "en" : "hi")}
          className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 transition"
          title="Switch Language"
        >
          <Languages className="w-3.5 h-3.5 text-blue-900" />
          <span className="hidden sm:inline">{lang === "hi" ? "English" : "हिंदी"}</span>
          <span className="sm:hidden">{lang === "hi" ? "EN" : "हिं"}</span>
        </button>

        {/* Day Report Action */}
        <button
          id="header-day-end-btn"
          onClick={onOpenDayEnd}
          className="hidden md:flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 transition"
          title="Print Day-End Report"
        >
          <Printer className="w-3.5 h-3.5 text-gray-600" />
          <span>{lang === "hi" ? "दैनिक रिपोर्ट" : "Day Report"}</span>
        </button>

        {/* Center Settings */}
        <button
          id="header-settings-btn"
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition"
          title="Center Profile & Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* + New Customer Token CTA */}
        <button
          id="header-new-token-btn"
          onClick={onOpenNewToken}
          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-xs transition active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span className="hidden sm:inline">{lang === "hi" ? "+ नया टोकन" : "+ New Token"}</span>
          <span className="sm:hidden">+ Token</span>
        </button>

        {/* Operator Profile Badge */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-gray-900 leading-tight truncate max-w-[120px]">
              {vle.vleName || "Rajesh Kumar"}
            </div>
            <div className="text-[10px] text-gray-500 font-medium">Operator Admin</div>
          </div>
          <div
            onClick={onOpenSettings}
            className="w-9 h-9 bg-blue-100 text-blue-900 font-bold rounded-full border border-blue-200 flex items-center justify-center text-xs shrink-0 cursor-pointer hover:ring-2 hover:ring-blue-300 transition"
            title={`${vle.vleName} (Operator Admin)`}
          >
            {getInitials(vle.vleName)}
          </div>
        </div>
      </div>
    </header>
  );
};

