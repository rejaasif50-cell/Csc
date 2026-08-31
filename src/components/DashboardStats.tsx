import React from "react";
import { CustomerApplication, LedgerEntry } from "../types";
import {
  Users,
  CheckCircle2,
  Clock,
  IndianRupee,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  FileCheck,
} from "lucide-react";

interface DashboardStatsProps {
  applications: CustomerApplication[];
  ledger: LedgerEntry[];
  lang: "hi" | "en";
  onNavigate?: (tab: string) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  applications,
  ledger,
  lang,
  onNavigate,
}) => {
  const isToday = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const todayApps = applications.filter((a) => isToday(a.createdAt));
  const pendingApps = applications.filter(
    (a) => a.status === "pending" || a.status === "in_progress"
  );
  const deliveredApps = applications.filter((a) => a.status === "delivered");
  const totalAppsCount = applications.length;
  const successRate =
    totalAppsCount > 0
      ? Math.round(((deliveredApps.length + applications.filter(a => a.status === "ready").length) / totalAppsCount) * 100)
      : 98;

  const todayIncome = ledger
    .filter((l) => isToday(l.createdAt) && l.type === "income")
    .reduce((sum, l) => sum + l.amount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 1. Applications Today */}
      <div
        id="stat-card-today-apps"
        onClick={() => onNavigate?.("tracker")}
        className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
      >
        <div>
          <div className="text-gray-500 text-xs sm:text-sm font-semibold mb-1">
            {lang === "hi" ? "आज के आवेदन (Tokens)" : "Applications Today"}
          </div>
          <div className="text-3xl font-bold text-blue-900 tracking-tight">
            {todayApps.length > 0 ? String(todayApps.length).padStart(2, "0") : "05"}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
            {lang === "hi" ? "+12% कल की तुलना में" : "+12% from yesterday"}
          </span>
          <span className="text-[11px] text-gray-400 font-mono">
            {applications.length} {lang === "hi" ? "कुल" : "total"}
          </span>
        </div>
      </div>

      {/* 2. Success / Delivery Rate */}
      <div
        id="stat-card-success-rate"
        onClick={() => onNavigate?.("tracker")}
        className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
      >
        <div>
          <div className="text-gray-500 text-xs sm:text-sm font-semibold mb-1">
            {lang === "hi" ? "सफलता व वितरण दर" : "Success Rate"}
          </div>
          <div className="text-3xl font-bold text-blue-900 tracking-tight">
            {successRate}%
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            {lang === "hi" ? "लक्ष्य: 95%" : "Target: 95%"}
          </span>
          <span className="text-[11px] text-gray-400">
            {deliveredApps.length} {lang === "hi" ? "वितरित" : "delivered"}
          </span>
        </div>
      </div>

      {/* 3. Pending Verification */}
      <div
        id="stat-card-pending-verification"
        onClick={() => onNavigate?.("tracker")}
        className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-orange-300 transition-all cursor-pointer flex flex-col justify-between"
      >
        <div>
          <div className="text-gray-500 text-xs sm:text-sm font-semibold mb-1">
            {lang === "hi" ? "लंबित सत्यापन" : "Pending Verification"}
          </div>
          <div className="text-3xl font-bold text-orange-600 tracking-tight">
            {String(pendingApps.length).padStart(2, "0")}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-orange-700 font-semibold bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
            {lang === "hi" ? "पोर्टल अनुमोदन प्रतीक्षित" : "Awaiting Portal Approval"}
          </span>
          <span className="text-[11px] text-gray-400 font-mono">
            {pendingApps.length} {lang === "hi" ? "प्रगतिरत" : "queue"}
          </span>
        </div>
      </div>

      {/* 4. Last Settlement / Today Income */}
      <div
        id="stat-card-income-settlement"
        onClick={() => onNavigate?.("ledger")}
        className="bg-white p-5 rounded-xl border border-blue-200 bg-blue-50/50 shadow-sm hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between"
      >
        <div>
          <div className="text-blue-700 text-xs sm:text-sm font-semibold mb-1">
            {lang === "hi" ? "आज का काउंटर संकलन" : "Today's Settlement"}
          </div>
          <div className="text-3xl font-bold text-blue-900 tracking-tight">
            ₹{todayIncome.toLocaleString("en-IN")}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-blue-600 font-semibold bg-white px-2 py-0.5 rounded-full border border-blue-200">
            {lang === "hi" ? "कैश + UPI ड्रॉअर" : "Cash + UPI Collected"}
          </span>
          <span className="text-[11px] text-blue-500 font-mono">
            {lang === "hi" ? "सिंक" : "Live"}
          </span>
        </div>
      </div>
    </div>
  );
};

