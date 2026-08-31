import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { DashboardStats } from "./components/DashboardStats";
import { ServicesCatalog } from "./components/ServicesCatalog";
import { CustomerTracker } from "./components/CustomerTracker";
import { CashLedger } from "./components/CashLedger";
import { PortalLauncher } from "./components/PortalLauncher";
import { ToolsSuite } from "./components/ToolsSuite";
import { AiAssistant } from "./components/AiAssistant";
import { ReceiptModal } from "./components/ReceiptModal";
import { NewApplicationModal } from "./components/NewApplicationModal";
import { CenterSettingsModal } from "./components/CenterSettingsModal";
import {
  CustomerApplication,
  LedgerEntry,
  VleProfile,
  CscService,
  ApplicationStatus,
} from "./types";
import { CSC_SERVICES } from "./data/cscServices";
import {
  PlusCircle,
  Sparkles,
  Printer,
  Globe,
  Wallet,
  FileCheck,
  Layers,
  Wrench,
  X,
  IndianRupee,
  Building2,
  Calendar,
  Home,
  CheckCircle2,
  Clock,
  Settings,
  HelpCircle,
} from "lucide-react";

const INITIAL_VLE: VleProfile = {
  vleName: "Rajesh Kumar Sharma",
  centerName: "Shri Krishna CSC Digital Seva Kendra",
  cscId: "364589210048",
  mobile: "9876543210",
  email: "csc.digitalseva@gmail.com",
  address: "Main Market Road, Near SBI Bank, Rampur",
  district: "Varanasi",
  state: "Uttar Pradesh",
  pincode: "221001",
  upiId: "9876543210@paytm",
};

const INITIAL_APPLICATIONS: CustomerApplication[] = [
  {
    id: "app-101",
    tokenNumber: 101,
    customerName: "Ramesh Chand Patel",
    customerMobile: "9812345678",
    customerAadhaarLast4: "5821",
    serviceId: "pan_new",
    serviceName: "New PAN Card (नया पैन कार्ड)",
    serviceCategory: "identity",
    status: "in_progress",
    acknowledgementNumber: "UTI-2025-884912",
    govtFee: 107,
    cscFee: 93,
    totalAmount: 200,
    isPaid: true,
    paymentMode: "upi",
    notes: "Aadhaar copy & 2 passport photos received",
    documentsCollected: ["Aadhaar Card Copy", "2 Passport Photos"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "app-102",
    tokenNumber: 102,
    customerName: "Sunita Devi",
    customerMobile: "9711223344",
    customerAadhaarLast4: "9043",
    serviceId: "caste_cert",
    serviceName: "Caste Certificate (जाति प्रमाण पत्र)",
    serviceCategory: "certificates",
    status: "submitted",
    acknowledgementNumber: "ED-UP-2025-004921",
    govtFee: 30,
    cscFee: 70,
    totalAmount: 100,
    isPaid: true,
    paymentMode: "cash",
    notes: "Gram Pradhan verification letter attached",
    documentsCollected: ["Aadhaar", "Ration Card", "Pradhan Verification"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "app-103",
    tokenNumber: 103,
    customerName: "Mohan Lal Yadav",
    customerMobile: "9456789123",
    customerAadhaarLast4: "1287",
    serviceId: "pm_kisan_ekyc",
    serviceName: "PM Kisan eKYC (बायोमेट्रिक सत्यापन)",
    serviceCategory: "govt_schemes",
    status: "delivered",
    acknowledgementNumber: "PMK-KYC-99214",
    govtFee: 15,
    cscFee: 35,
    totalAmount: 50,
    isPaid: true,
    paymentMode: "cash",
    notes: "Biometric eKYC successful on PM Kisan portal",
    documentsCollected: ["Aadhaar Card"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "app-104",
    tokenNumber: 104,
    customerName: "Pooja Sharma",
    customerMobile: "9654123098",
    customerAadhaarLast4: "6654",
    serviceId: "ayushman_card",
    serviceName: "Ayushman Card Print (आयुष्मान कार्ड PVC)",
    serviceCategory: "govt_schemes",
    status: "ready",
    acknowledgementNumber: "AB-PMJAY-4410",
    govtFee: 0,
    cscFee: 50,
    totalAmount: 50,
    isPaid: true,
    paymentMode: "cash",
    notes: "PVC card printed and ready for pickup",
    documentsCollected: ["Ayushman Reference Slip"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "app-105",
    tokenNumber: 105,
    customerName: "Anil Kumar Maurya",
    customerMobile: "9123456780",
    customerAadhaarLast4: "3312",
    serviceId: "aadhaar_update",
    serviceName: "Aadhaar Address Update (आधार पता सुधार)",
    serviceCategory: "identity",
    status: "pending",
    govtFee: 50,
    cscFee: 50,
    totalAmount: 100,
    isPaid: false,
    paymentMode: "cash",
    notes: "Waiting for electricity bill document scan",
    documentsCollected: ["Aadhaar Copy"],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_LEDGER: LedgerEntry[] = [
  {
    id: "led-1",
    type: "income",
    title: "New PAN Card Application Fee",
    titleHi: "नया पैन कार्ड आवेदन शुल्क",
    amount: 200,
    paymentMode: "upi",
    category: "CSC Service Fee",
    customerName: "Ramesh Chand Patel",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "led-2",
    type: "income",
    title: "Caste Certificate E-District Form",
    titleHi: "जाति प्रमाण पत्र आवेदन",
    amount: 100,
    paymentMode: "cash",
    category: "Certificates",
    customerName: "Sunita Devi",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "led-3",
    type: "income",
    title: "PM Kisan eKYC Biometric",
    titleHi: "पीएम किसान ई-केवाईसी",
    amount: 50,
    paymentMode: "cash",
    category: "Govt Schemes",
    customerName: "Mohan Lal Yadav",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
  },
  {
    id: "led-4",
    type: "aeps_withdrawal",
    title: "SBI AEPS Cash Withdrawal",
    titleHi: "एसबीआई आधार कैश निकासी",
    amount: 3000,
    paymentMode: "cash",
    category: "AEPS Banking",
    customerName: "Ram Prasad",
    aepsCommission: 10,
    notes: "Cash given from counter, money added to Digipay wallet",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "led-5",
    type: "expense",
    title: "JK A4 Copier Paper (1 Ream)",
    titleHi: "जेके ए4 पेपर रिम खरीद",
    amount: 280,
    paymentMode: "cash",
    category: "Shop Stationary",
    notes: "For certificate printouts",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "led-6",
    type: "income",
    title: "PVC Ayushman Card Lamination",
    titleHi: "आयुष्मान कार्ड पीवीसी प्रिंट",
    amount: 50,
    paymentMode: "cash",
    category: "PVC Printing",
    customerName: "Pooja Sharma",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

export default function App() {
  // Navigation & Language
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "services" | "tracker" | "ledger" | "portals" | "tools" | "ai_assistant"
  >("dashboard");
  const [lang, setLang] = useState<"hi" | "en">(() => {
    return (localStorage.getItem("csc_lang") as "hi" | "en") || "hi";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Center Profile
  const [vle, setVle] = useState<VleProfile>(() => {
    const saved = localStorage.getItem("csc_vle_profile");
    return saved ? JSON.parse(saved) : INITIAL_VLE;
  });

  // Applications
  const [applications, setApplications] = useState<CustomerApplication[]>(() => {
    const saved = localStorage.getItem("csc_applications");
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  // Cash Ledger
  const [ledger, setLedger] = useState<LedgerEntry[]>(() => {
    const saved = localStorage.getItem("csc_ledger");
    return saved ? JSON.parse(saved) : INITIAL_LEDGER;
  });

  // Modals
  const [selectedReceiptApp, setSelectedReceiptApp] = useState<CustomerApplication | null>(null);
  const [showNewTokenModal, setShowNewTokenModal] = useState(false);
  const [selectedServiceForNewToken, setSelectedServiceForNewToken] = useState<CscService | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDayEndPrintModal, setShowDayEndPrintModal] = useState(false);
  const [selectedServiceForAi, setSelectedServiceForAi] = useState<CscService | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("csc_lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("csc_vle_profile", JSON.stringify(vle));
  }, [vle]);

  useEffect(() => {
    localStorage.setItem("csc_applications", JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem("csc_ledger", JSON.stringify(ledger));
  }, [ledger]);

  // Handlers
  const handleCreateNewApplication = (
    appData: Omit<CustomerApplication, "id" | "tokenNumber" | "createdAt" | "updatedAt">
  ) => {
    const nextToken =
      applications.length > 0
        ? Math.max(...applications.map((a) => a.tokenNumber)) + 1
        : 101;

    const newApp: CustomerApplication = {
      ...appData,
      id: `app-${Date.now()}`,
      tokenNumber: nextToken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setApplications((prev) => [newApp, ...prev]);

    // If paid, auto-add to ledger
    if (newApp.isPaid) {
      const newLedgerEntry: LedgerEntry = {
        id: `led-${Date.now()}`,
        type: "income",
        title: `${newApp.serviceName} (#${newApp.tokenNumber})`,
        titleHi: `${newApp.serviceName} (#${newApp.tokenNumber})`,
        amount: newApp.totalAmount,
        paymentMode: newApp.paymentMode as any,
        category: "CSC Service Fee",
        customerName: newApp.customerName,
        createdAt: new Date().toISOString(),
      };
      setLedger((prev) => [newLedgerEntry, ...prev]);
    }

    // Auto open receipt
    setSelectedReceiptApp(newApp);
  };

  const handleUpdateAppStatus = (
    id: string,
    status: ApplicationStatus,
    acknowledgementNumber?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          return {
            ...app,
            status,
            acknowledgementNumber:
              acknowledgementNumber !== undefined
                ? acknowledgementNumber
                : app.acknowledgementNumber,
            updatedAt: new Date().toISOString(),
          };
        }
        return app;
      })
    );
  };

  const handleDeleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddLedgerEntry = (entry: Omit<LedgerEntry, "id" | "createdAt">) => {
    const newEntry: LedgerEntry = {
      ...entry,
      id: `led-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setLedger((prev) => [newEntry, ...prev]);
  };

  const handleDeleteLedgerEntry = (id: string) => {
    setLedger((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSelectServiceForToken = (service: CscService) => {
    setSelectedServiceForNewToken(service);
    setShowNewTokenModal(true);
  };

  const handleAskAiAboutService = (service: CscService) => {
    setSelectedServiceForAi(service);
    setActiveTab("ai_assistant");
  };

  // Compute live counter cash balance
  const cashInCounter = ledger.reduce((sum, e) => {
    if (e.paymentMode !== "cash") return sum;
    if (e.type === "income") return sum + e.amount;
    if (e.type === "expense") return sum - e.amount;
    if (e.type === "aeps_withdrawal") return sum - e.amount;
    return sum;
  }, 4820);

  // Popular Services for 6-Grid matching Design HTML
  const popularGovtServices = [
    {
      id: "aadhaar_update",
      letter: "A",
      titleEn: "Aadhar Update & Print",
      titleHi: "आधार सुधार व प्रिंट",
      color: "bg-blue-100 text-blue-700",
      serviceId: "aadhaar_update",
    },
    {
      id: "pan_new",
      letter: "P",
      titleEn: "PAN Card New/Apply",
      titleHi: "नया पैन कार्ड आवेदन",
      color: "bg-orange-100 text-orange-700",
      serviceId: "pan_new",
    },
    {
      id: "electricity_bill",
      letter: "E",
      titleEn: "Electricity Bill Pay",
      titleHi: "बिजली बिल भुगतान",
      color: "bg-green-100 text-green-700",
      serviceId: "electricity_bill",
    },
    {
      id: "voter_services",
      letter: "V",
      titleEn: "Voter ID Services",
      titleHi: "वोटर आईडी सेवाएं",
      color: "bg-red-100 text-red-700",
      serviceId: "voter_new",
    },
    {
      id: "banking_aeps",
      letter: "B",
      titleEn: "Banking & AePS",
      titleHi: "बैंकिंग व AEPS निकासी",
      color: "bg-purple-100 text-purple-700",
      serviceId: "aeps_cash",
    },
    {
      id: "ayushman_card",
      letter: "I",
      titleEn: "PM Kisan & Ayushman",
      titleHi: "पीएम किसान व आयुष्मान",
      color: "bg-yellow-100 text-yellow-700",
      serviceId: "ayushman_card",
    },
  ];

  // Helper for quick avatar initials
  const getCustomerInitials = (name: string) => {
    if (!name) return "AZ";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const navLinksMain = [
    { id: "dashboard", nameEn: "Home", nameHi: "डैशबोर्ड (Home)" },
    { id: "services", nameEn: "All Services", nameHi: "सेवा सूची व दस्तावेज़" },
    { id: "tracker", nameEn: "Application Tracker", nameHi: "टोकन व आवेदन ट्रैकर" },
    { id: "ledger", nameEn: "Wallet & Ledger", nameHi: "दैनिक कैश व AEPS" },
  ];

  const navLinksTools = [
    { id: "portals", nameEn: "Official Portals", nameHi: "सरकारी पोर्टल लिंक्स" },
    { id: "tools", nameEn: "Photo & Toolbox", nameHi: "फोटो व टूल्स" },
    { id: "ai_assistant", nameEn: "CSC Sahayak AI", nameHi: "सीएससी AI सहायक", isAi: true },
  ];

  return (
    <div className="flex h-screen w-full bg-[#F3F4F6] font-sans text-gray-900 overflow-hidden select-none">
      {/* 1. SIDEBAR (Desktop: Fixed Left Sidebar, Mobile: Slide-in Drawer) */}
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`w-64 bg-blue-900 text-white flex flex-col shrink-0 z-50 transition-transform duration-200 ease-in-out fixed inset-y-0 left-0 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-blue-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <div className="w-6 h-6 border-4 border-blue-900 rounded-full flex items-center justify-center">
                <span className="font-extrabold text-[8px] text-blue-900 tracking-tighter">CSC</span>
              </div>
            </div>
            <div>
              <h1 className="font-bold text-xl leading-tight tracking-tight">Digital Seva</h1>
              <p className="text-[10px] text-blue-300 font-medium">जन सेवा केंद्र पोर्टल</p>
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden text-blue-300 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto space-y-6">
          <div>
            <div className="px-6 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">
              {lang === "hi" ? "मुख्य डैशबोर्ड" : "Main Dashboard"}
            </div>
            <div className="space-y-1 px-3">
              {navLinksMain.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    id={`sidebar-link-${link.id}`}
                    onClick={() => {
                      setActiveTab(link.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left ${
                      isActive
                        ? "bg-blue-800 text-white font-semibold shadow-xs"
                        : "text-blue-100/80 hover:bg-blue-800/60 hover:text-white"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? "bg-blue-400" : "bg-gray-400 opacity-60"
                      }`}
                    ></span>
                    <span>{lang === "hi" ? link.nameHi : link.nameEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="px-6 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">
              {lang === "hi" ? "टूल्स व आधिकारिक सहायता" : "Official Support & Tools"}
            </div>
            <div className="space-y-1 px-3">
              {navLinksTools.map((link) => {
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    id={`sidebar-link-${link.id}`}
                    onClick={() => {
                      setActiveTab(link.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors text-left ${
                      isActive
                        ? "bg-blue-800 text-white font-semibold shadow-xs"
                        : "text-blue-100/80 hover:bg-blue-800/60 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isActive ? "bg-blue-400" : "bg-gray-400 opacity-60"
                        }`}
                      ></span>
                      <span>{lang === "hi" ? link.nameHi : link.nameEn}</span>
                    </div>
                    {link.isAi && (
                      <span className="text-[10px] bg-amber-400 text-blue-950 font-black px-1.5 py-0.5 rounded uppercase">
                        AI
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                id="sidebar-link-settings"
                onClick={() => {
                  setShowSettingsModal(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-blue-100/80 hover:bg-blue-800/60 hover:text-white transition-colors text-left"
              >
                <span className="w-2 h-2 rounded-full bg-gray-400 opacity-60"></span>
                <span>{lang === "hi" ? "केंद्र सेटिंग्स" : "Center Settings"}</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Bottom Drawer in Sidebar: VLE ID & Wallet */}
        <div className="p-6 bg-blue-950 flex flex-col gap-1 border-t border-blue-900/60">
          <div className="text-xs text-blue-200/80 font-mono flex items-center justify-between">
            <span>VLE ID: {vle.cscId || "490211320012"}</span>
          </div>
          <div className="text-sm font-semibold text-green-400 flex items-center justify-between">
            <span>Wallet: ₹{cashInCounter.toLocaleString("en-IN")}</span>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" title="System Active"></span>
          </div>
        </div>
      </aside>

      {/* 2. MAIN APPLICATION CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <Header
          vle={vle}
          lang={lang}
          setLang={setLang}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenNewToken={() => {
            setSelectedServiceForNewToken(null);
            setShowNewTokenModal(true);
          }}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenDayEnd={() => setShowDayEndPrintModal(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Scrollable View Canvas */}
        <section className="p-6 lg:p-8 flex flex-col gap-6 flex-1 overflow-y-auto">
          {/* VIEW 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-6">
              {/* Top 4 KPI Stat Cards */}
              <DashboardStats
                applications={applications}
                ledger={ledger}
                lang={lang}
                onNavigate={(tab) => setActiveTab(tab as any)}
              />

              {/* 3-Column Grid Matching Design HTML */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left 2 Cols: Popular Government Services */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
                  <h2 className="text-lg font-bold mb-4 flex justify-between items-center text-gray-900">
                    <span>{lang === "hi" ? "लोकप्रिय सरकारी सेवाएं" : "Popular Government Services"}</span>
                    <button
                      onClick={() => setActiveTab("services")}
                      className="text-sm text-blue-600 font-normal hover:underline cursor-pointer"
                    >
                      {lang === "hi" ? "सभी देखें →" : "View All"}
                    </button>
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {popularGovtServices.map((srv) => {
                      const matched = CSC_SERVICES.find((s) => s.id === srv.serviceId) || CSC_SERVICES[0];
                      return (
                        <div
                          key={srv.id}
                          id={`service-tile-${srv.id}`}
                          onClick={() => handleSelectServiceForToken(matched)}
                          className="border border-gray-100 bg-gray-50/80 p-4 rounded-lg flex flex-col items-center text-center gap-3 cursor-pointer hover:border-blue-300 hover:bg-blue-50/40 transition-all group"
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-xs transition-transform group-hover:scale-105 ${srv.color}`}
                          >
                            {srv.letter}
                          </div>
                          <span className="text-sm font-semibold leading-tight text-gray-900">
                            {lang === "hi" ? srv.titleHi : srv.titleEn}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Below Services: Quick Applications Snapshot */}
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {lang === "hi" ? "हाल के ग्राहक टोकन कतार" : "Live Customer Queue"}
                      </h3>
                      <button
                        onClick={() => setActiveTab("tracker")}
                        className="text-xs text-blue-600 font-bold hover:underline"
                      >
                        {lang === "hi" ? "ट्रैकर में खोलें →" : "Open Tracker →"}
                      </button>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {applications.slice(0, 3).map((app) => (
                        <div
                          key={app.id}
                          className="py-2.5 flex items-center justify-between gap-3 hover:bg-gray-50 rounded-lg px-2 transition"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded bg-blue-50 text-blue-900 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200">
                              #{app.tokenNumber}
                            </span>
                            <div>
                              <div className="font-bold text-gray-900 text-xs sm:text-sm">
                                {app.customerName}
                              </div>
                              <div className="text-[11px] text-gray-500 flex items-center gap-2">
                                <span>{app.serviceName}</span>
                                <span>•</span>
                                <span className="font-mono">₹{app.totalAmount}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                                app.status === "ready"
                                  ? "bg-cyan-50 text-cyan-800 border-cyan-200"
                                  : app.status === "delivered"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : app.status === "submitted"
                                  ? "bg-purple-50 text-purple-800 border-purple-200"
                                  : "bg-amber-50 text-amber-800 border-amber-200"
                              }`}
                            >
                              {app.status.replace("_", " ")}
                            </span>

                            <button
                              onClick={() => setSelectedReceiptApp(app)}
                              className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
                              title="Print Receipt"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right 1 Col: Recent Activity Stream */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
                  <h2 className="text-lg font-bold mb-4 text-gray-900">
                    {lang === "hi" ? "हालिया गतिविधियाँ" : "Recent Activity"}
                  </h2>

                  <div className="space-y-4 flex-1">
                    {applications.slice(0, 4).map((app, idx) => {
                      const colorVariants = [
                        { bg: "bg-blue-50", text: "text-blue-600" },
                        { bg: "bg-orange-50", text: "text-orange-600" },
                        { bg: "bg-green-50", text: "text-green-600" },
                        { bg: "bg-purple-50", text: "text-purple-600" },
                      ];
                      const style = colorVariants[idx % colorVariants.length];
                      const initials = getCustomerInitials(app.customerName);

                      return (
                        <div
                          key={app.id}
                          className="flex gap-3 border-b border-gray-50 pb-3 items-center"
                        >
                          <div
                            className={`w-8 h-8 rounded ${style.bg} ${style.text} flex items-center justify-center text-xs font-bold shrink-0`}
                          >
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {app.serviceName} - {app.customerName}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <span>
                                {new Date(app.createdAt).toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              <span>•</span>
                              <span className="capitalize text-emerald-600 font-medium">
                                {app.status === "delivered"
                                  ? "Successful"
                                  : app.status === "ready"
                                  ? "Ready"
                                  : "Processing"}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm font-bold text-gray-700 font-mono">
                            ₹{app.totalAmount}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    id="download-day-report-btn"
                    onClick={() => setShowDayEndPrintModal(true)}
                    className="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4 text-gray-600" />
                    <span>{lang === "hi" ? "दैनिक रिपोर्ट डाउनलोड व प्रिंट करें" : "Download Day Report"}</span>
                  </button>

                  {/* VLE Tool Shortcut Banner */}
                  <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs text-amber-300 font-bold uppercase tracking-wider">
                      <span>{lang === "hi" ? "VLE टूलबॉक्स" : "Quick VLE Suite"}</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    </div>
                    <p className="text-xs text-blue-100 leading-snug">
                      {lang === "hi"
                        ? "पैन 213x213px फोटो रिसाइजर, आयु कैलकुलेटर व कानूनी शपथ पत्र।"
                        : "PAN Photo Resizer (213x213px), Age Calculator & Legal Affidavits."}
                    </p>
                    <button
                      onClick={() => setActiveTab("tools")}
                      className="mt-1 w-full py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs text-center transition"
                    >
                      {lang === "hi" ? "टूल्स खोलें →" : "Open Toolbox →"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: SERVICES CATALOG */}
          {activeTab === "services" && (
            <ServicesCatalog
              lang={lang}
              onSelectServiceForToken={handleSelectServiceForToken}
              onAskAiAboutService={handleAskAiAboutService}
            />
          )}

          {/* VIEW 3: CUSTOMER TRACKER */}
          {activeTab === "tracker" && (
            <CustomerTracker
              applications={applications}
              vle={vle}
              lang={lang}
              onUpdateStatus={handleUpdateAppStatus}
              onDeleteApplication={handleDeleteApplication}
              onOpenReceipt={(app) => setSelectedReceiptApp(app)}
              onOpenNewToken={() => {
                setSelectedServiceForNewToken(null);
                setShowNewTokenModal(true);
              }}
            />
          )}

          {/* VIEW 4: CASH LEDGER & AEPS */}
          {activeTab === "ledger" && (
            <CashLedger
              ledger={ledger}
              vle={vle}
              lang={lang}
              onAddEntry={handleAddLedgerEntry}
              onDeleteEntry={handleDeleteLedgerEntry}
              onOpenDayEndPrint={() => setShowDayEndPrintModal(true)}
            />
          )}

          {/* VIEW 5: PORTAL LAUNCHER */}
          {activeTab === "portals" && <PortalLauncher lang={lang} />}

          {/* VIEW 6: VLE TOOLS SUITE */}
          {activeTab === "tools" && <ToolsSuite vle={vle} lang={lang} />}

          {/* VIEW 7: AI ASSISTANT */}
          {activeTab === "ai_assistant" && (
            <AiAssistant
              vle={vle}
              lang={lang}
              initialServiceQuery={selectedServiceForAi}
            />
          )}
        </section>

        {/* 3. FOOTER Matching Design HTML */}
        <footer className="h-12 bg-white border-t border-gray-200 flex items-center justify-between px-6 lg:px-8 text-xs text-gray-500 shrink-0">
          <div className="truncate">
            CSC Portal v4.2.1 • Licensed to <span className="font-semibold text-gray-700">{vle.centerName || "Digital Seva Kendra"}</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span>Security Status: <span className="text-green-600 font-semibold">ENCRYPTED</span></span>
            <span>•</span>
            <span>Last Sync: Today</span>
          </div>
        </footer>
      </div>

      {/* MODALS */}
      {/* 1. Receipt Modal */}
      {selectedReceiptApp && (
        <ReceiptModal
          application={selectedReceiptApp}
          vle={vle}
          lang={lang}
          onClose={() => setSelectedReceiptApp(null)}
        />
      )}

      {/* 2. New Token Modal */}
      {showNewTokenModal && (
        <NewApplicationModal
          initialService={selectedServiceForNewToken}
          lang={lang}
          onClose={() => {
            setShowNewTokenModal(false);
            setSelectedServiceForNewToken(null);
          }}
          onSubmit={handleCreateNewApplication}
        />
      )}

      {/* 3. Center Settings Modal */}
      {showSettingsModal && (
        <CenterSettingsModal
          vle={vle}
          lang={lang}
          onClose={() => setShowSettingsModal(false)}
          onSave={(updated) => setVle(updated)}
        />
      )}

      {/* 4. Day-End Print Summary Modal */}
      {showDayEndPrintModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {lang === "hi" ? "डे-एंड (दैनिक समाप्ति) रिपोर्ट प्रिंट" : "Day-End Cash & Banking Summary"}
              </h3>
              <button
                onClick={() => setShowDayEndPrintModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <p className="text-slate-600">
                {lang === "hi"
                  ? "आज की सभी सेवाओं, नकद आवक, AEPS निकासी एवं ख़र्चों की संकलित रिपोर्ट प्रिंट करें।"
                  : "Print consolidated summary of today's income, AEPS banking cash, and shop expenses."}
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Center:</span>
                  <span className="font-bold text-slate-900">{vle.centerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-semibold text-slate-800">{new Date().toLocaleDateString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Customer Tokens Today:</span>
                  <span className="font-bold text-blue-900">{applications.length}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-bold">
                  <span>Total Income:</span>
                  <span className="text-emerald-700">
                    ₹{ledger.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowDayEndPrintModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                {lang === "hi" ? "बंद करें" : "Close"}
              </button>
              <button
                onClick={() => {
                  const printWin = window.open("", "_blank");
                  if (printWin) {
                    printWin.document.write(`
                      <html>
                        <head>
                          <title>Day-End Report - ${vle.centerName}</title>
                          <style>
                            body { font-family: Arial, sans-serif; padding: 30px; font-size: 13px; color: #111; }
                            h2 { margin: 0; color: #1e3a8a; }
                            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                            th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
                            th { background: #f8fafc; }
                          </style>
                        </head>
                        <body>
                          <h2>${vle.centerName}</h2>
                          <p>VLE: ${vle.vleName} | CSC ID: ${vle.cscId} | Date: ${new Date().toLocaleDateString("en-IN")}</p>
                          <hr/>
                          <h3>Daily Accounts Summary</h3>
                          <table>
                            <tr><th>Particulars</th><th>Amount (₹)</th></tr>
                            <tr><td>Total Service Income</td><td>₹${ledger.filter(e => e.type === "income").reduce((s, e) => s + e.amount, 0)}</td></tr>
                            <tr><td>AEPS Cash Disbursed</td><td>₹${ledger.filter(e => e.type === "aeps_withdrawal").reduce((s, e) => s + e.amount, 0)}</td></tr>
                            <tr><td>Shop Expenses</td><td>₹${ledger.filter(e => e.type === "expense").reduce((s, e) => s + e.amount, 0)}</td></tr>
                          </table>
                          <script>window.print();</script>
                        </body>
                      </html>
                    `);
                    printWin.document.close();
                  }
                  setShowDayEndPrintModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{lang === "hi" ? "प्रिंट निकालें" : "Print Report"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

