import React, { useState } from "react";
import { PORTAL_LINKS } from "../data/portalLinks";
import { PortalLink } from "../types";
import {
  ExternalLink,
  Search,
  Globe,
  ShieldCheck,
  CreditCard,
  Fingerprint,
  HeartPulse,
  Sprout,
  Hammer,
  Vote,
  Car,
  Truck,
  FolderLock,
  GraduationCap,
  Briefcase,
  Receipt,
  FileBadge,
  BookOpen,
} from "lucide-react";

interface PortalLauncherProps {
  lang: "hi" | "en";
}

export const PortalLauncher: React.FC<PortalLauncherProps> = ({ lang }) => {
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("All");

  const iconMap: Record<string, any> = {
    ShieldCheck,
    CreditCard,
    Fingerprint,
    HeartPulse,
    Sprout,
    Hammer,
    Vote,
    Car,
    Truck,
    FolderLock,
    GraduationCap,
    Briefcase,
    Receipt,
    FileBadge,
    BookOpen,
  };

  const categories = ["All", "CSC Core", "Identity", "Govt Schemes", "Transport", "Education", "Business", "Certificates"];

  const filteredPortals = PORTAL_LINKS.filter((p) => {
    const matchesCat = selectedCat === "All" || p.category === selectedCat;
    const q = search.toLowerCase();
    if (!q) return matchesCat;
    return (
      matchesCat &&
      (p.name.toLowerCase().includes(q) ||
        p.nameHi.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.descriptionHi.toLowerCase().includes(q) ||
        p.url.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-900" />
              <span>{lang === "hi" ? "आधिकारिक सरकारी पोर्टल डायरेक्ट लॉन्चर" : "Direct Official Government Portals"}</span>
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              {lang === "hi"
                ? "सीएससी वीएलई हेतु सभी मुख्य केंद्र एवं राज्य सरकार पोर्टल्स के 1-क्लिक सीधे लिंक।"
                : "1-click verified portal shortcuts for UIDAI, PAN, E-District, Parivahan, PM-Kisan, Ayushman, and NSP."}
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={lang === "hi" ? "पोर्टल खोजें (UIDAI, PAN, Sarathi)..." : "Search portals..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 mt-3 border-t border-gray-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCat === cat
                  ? "bg-blue-900 text-white shadow-xs"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Portals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPortals.map((portal) => {
          const Icon = iconMap[portal.iconName] || Globe;
          return (
            <div
              key={portal.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 border border-blue-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        {lang === "hi" ? portal.nameHi : portal.name}
                      </h3>
                      <span className="text-[10px] text-blue-900 font-semibold uppercase">
                        {portal.category}
                      </span>
                    </div>
                  </div>

                  {portal.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      {portal.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 mt-2.5 line-clamp-2">
                  {lang === "hi" ? portal.descriptionHi : portal.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-mono truncate max-w-[170px]">
                  {portal.url.replace("https://", "")}
                </span>

                <a
                  href={portal.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <span>{lang === "hi" ? "पोर्टल खोलें" : "Open Link"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
