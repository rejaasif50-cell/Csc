import React, { useState } from "react";
import { CSC_SERVICES } from "../data/cscServices";
import { CscService, ServiceCategory } from "../types";
import {
  Search,
  FileText,
  Clock,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  IndianRupee,
  Layers,
  Sparkles,
  Camera,
} from "lucide-react";

interface ServicesCatalogProps {
  lang: "hi" | "en";
  onSelectServiceForToken: (service: CscService) => void;
  onAskAiAboutService: (service: CscService) => void;
}

export const ServicesCatalog: React.FC<ServicesCatalogProps> = ({
  lang,
  onSelectServiceForToken,
  onAskAiAboutService,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("all");
  const [activeModalService, setActiveModalService] = useState<CscService | null>(null);

  const categories: { id: ServiceCategory; nameEn: string; nameHi: string }[] = [
    { id: "all", nameEn: "All Services (सभी सेवाएँ)", nameHi: "सभी सेवाएँ" },
    { id: "identity", nameEn: "Identity & Cards (Aadhaar/PAN)", nameHi: "पहचान व कार्ड (आधार/पैन/वोटर)" },
    { id: "govt_schemes", nameEn: "Govt Schemes (योजनाएं)", nameHi: "सरकारी योजनाएं (PM Kisan/Ayushman)" },
    { id: "certificates", nameEn: "Certificates (जाति/आय/निवास)", nameHi: "प्रमाण पत्र (E-District)" },
    { id: "banking_aeps", nameEn: "Banking & AEPS (बैंकिंग)", nameHi: "बैंकिंग व AEPS" },
    { id: "transport", nameEn: "Transport (लाइसेंस/वाहन)", nameHi: "परिवहन (DL/RC/FASTag)" },
    { id: "education", nameEn: "Education & Exams (शिक्षा/फॉर्म)", nameHi: "शिक्षा व भर्ती फॉर्म" },
    { id: "utility_bills", nameEn: "Utility & Bills (बिजली/राशन)", nameHi: "बिल भुगतान व राशन" },
    { id: "business_tax", nameEn: "Business & Tax (ITR/Udyam)", nameHi: "व्यापार व टैक्स (MSME/GST)" },
    { id: "document_services", nameEn: "Printing & Typing (फोटो/पीवीसी)", nameHi: "प्रिंटिंग, फोटो व टाइपिंग" },
  ];

  const filteredServices = CSC_SERVICES.filter((srv) => {
    const matchesCategory =
      selectedCategory === "all" || srv.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesName =
      srv.name.toLowerCase().includes(query) ||
      srv.nameHi.toLowerCase().includes(query) ||
      srv.description.toLowerCase().includes(query) ||
      srv.descriptionHi.toLowerCase().includes(query) ||
      srv.requiredDocuments.some((d) => d.toLowerCase().includes(query)) ||
      srv.requiredDocumentsHi.some((d) => d.toLowerCase().includes(query));

    return matchesCategory && matchesName;
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-900" />
              <span>{lang === "hi" ? "सीएससी सेवा निर्देशिका एवं दस्तावेज़ सूची" : "CSC Services & Document Guidelines"}</span>
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              {lang === "hi"
                ? "सभी सरकारी, पहचान, बैंकिंग एवं ई-डिस्ट्रिक्ट सेवाओं की आधिकारिक जानकारी, आवश्यक कागजात व शुल्क।"
                : "Official requirements, document checklist, government fees, and portal links for CSC services."}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="service-search-input"
              type="text"
              placeholder={lang === "hi" ? "सेवा या दस्तावेज़ खोजें..." : "Search service, PAN, Aadhaar, Caste..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-4 mt-3 border-t border-gray-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`service-cat-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-blue-900 text-white shadow-xs"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {lang === "hi" ? cat.nameHi : cat.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            id={`service-card-${service.id}`}
            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between p-5 group"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-900 transition">
                  {lang === "hi" ? service.nameHi : service.name}
                </h3>
                {service.isPopular && (
                  <span className="shrink-0 bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    ★ Popular
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                {lang === "hi" ? service.descriptionHi : service.description}
              </p>

              {/* Fee and Processing Badge */}
              <div className="grid grid-cols-2 gap-2 mt-4 p-2.5 bg-gray-50 rounded-lg border border-gray-100 text-xs">
                <div>
                  <span className="text-[11px] text-gray-500 block">
                    {lang === "hi" ? "सरकारी + VLE शुल्क" : "Total Approx Fee"}
                  </span>
                  <span className="font-bold text-gray-900 flex items-center">
                    <IndianRupee className="w-3 h-3" />
                    {service.govtFee + service.cscServiceCharge}
                    <span className="text-[10px] text-gray-500 font-normal ml-1">
                      (Govt: ₹{service.govtFee} + VLE: ₹{service.cscServiceCharge})
                    </span>
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">
                    {lang === "hi" ? "समय सीमा" : "Time"}
                  </span>
                  <span className="font-medium text-gray-700 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    {service.processingDays}
                  </span>
                </div>
              </div>

              {/* Documents preview snippet */}
              <div className="mt-3">
                <span className="text-[11px] font-semibold text-gray-700 block mb-1.5 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-blue-900" />
                  {lang === "hi" ? "मुख्य दस्तावेज़:" : "Key Required Documents:"}
                </span>
                <ul className="text-xs text-gray-600 space-y-1 pl-1">
                  {(lang === "hi" ? service.requiredDocumentsHi : service.requiredDocuments)
                    .slice(0, 2)
                    .map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span className="line-clamp-1">{doc}</span>
                      </li>
                    ))}
                  {service.requiredDocuments.length > 2 && (
                    <li className="text-[11px] text-blue-900 font-medium pl-3">
                      +{service.requiredDocuments.length - 2} {lang === "hi" ? "और दस्तावेज़..." : "more documents..."}
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Card Actions */}
            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-2">
              <button
                id={`btn-view-details-${service.id}`}
                onClick={() => setActiveModalService(service)}
                className="flex-1 text-xs py-2 px-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 text-gray-700 font-semibold transition text-center cursor-pointer"
              >
                {lang === "hi" ? "पूरी जानकारी देखें" : "View Checklist"}
              </button>

              <button
                id={`btn-apply-token-${service.id}`}
                onClick={() => onSelectServiceForToken(service)}
                className="flex-1 text-xs py-2 px-3 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{lang === "hi" ? "टोकन बनाएं" : "New Token"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 font-medium">
            {lang === "hi"
              ? "कोई सेवा नहीं मिली। कृपया कोई अन्य नाम या श्रेणी खोजें।"
              : "No service matched your search query. Try searching for PAN, Aadhaar, Caste, or Kisan."}
          </p>
        </div>
      )}

      {/* Service Details & Document Checklist Modal */}
      {activeModalService && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-gray-200 max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 bg-blue-900 text-white flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                  {activeModalService.category.replace("_", " ")}
                </span>
                <h3 className="text-xl font-bold mt-0.5 text-white">
                  {lang === "hi" ? activeModalService.nameHi : activeModalService.name}
                </h3>
                <p className="text-xs text-blue-200 mt-1">
                  Portal: <span className="font-semibold text-white">{activeModalService.portalName}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveModalService(null)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {lang === "hi" ? "विवरण (Description)" : "Description"}
                </h4>
                <p className="text-gray-800 leading-relaxed">
                  {lang === "hi" ? activeModalService.descriptionHi : activeModalService.description}
                </p>
              </div>

              {/* Fee & Timeline Box */}
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-gray-50 border border-gray-200 rounded-lg text-center">
                <div>
                  <span className="text-xs text-gray-500 block">{lang === "hi" ? "सरकारी शुल्क" : "Govt Fee"}</span>
                  <span className="text-base font-bold text-gray-900">₹{activeModalService.govtFee}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">{lang === "hi" ? "VLE सेवा शुल्क" : "CSC Service Fee"}</span>
                  <span className="text-base font-bold text-blue-900">₹{activeModalService.cscServiceCharge}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">{lang === "hi" ? "समय सीमा" : "Processing Time"}</span>
                  <span className="text-xs font-semibold text-gray-800">{activeModalService.processingDays}</span>
                </div>
              </div>

              {/* Required Documents Checklist */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-900" />
                  <span>{lang === "hi" ? "आवश्यक दस्तावेज़ों की सूची (Checklist)" : "Mandatory Document Checklist"}</span>
                </h4>
                <div className="bg-blue-50/40 border border-blue-100 rounded-lg p-4 space-y-2">
                  {(lang === "hi" ? activeModalService.requiredDocumentsHi : activeModalService.requiredDocuments).map(
                    (doc, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-gray-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-medium">{doc}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Photo & Signature Specs if available */}
              {(activeModalService.photoRequirements || activeModalService.signatureRequirements) && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span>{lang === "hi" ? "फोटो एवं हस्ताक्षर माप (Specs)" : "Photo & Signature Upload Guidelines"}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-amber-50/50 border border-amber-200 rounded-lg p-3.5">
                    {activeModalService.photoRequirements && (
                      <div>
                        <span className="font-bold text-amber-900 block">{lang === "hi" ? "फोटो माप:" : "Photo Specs:"}</span>
                        <p className="text-gray-700 mt-0.5">{activeModalService.photoRequirements}</p>
                      </div>
                    )}
                    {activeModalService.signatureRequirements && (
                      <div>
                        <span className="font-bold text-amber-900 block">{lang === "hi" ? "हस्ताक्षर माप:" : "Signature Specs:"}</span>
                        <p className="text-gray-700 mt-0.5">{activeModalService.signatureRequirements}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3 flex-wrap">
              <button
                onClick={() => {
                  onAskAiAboutService(activeModalService);
                  setActiveModalService(null);
                }}
                className="text-xs text-blue-900 hover:text-blue-950 font-semibold flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-900" />
                <span>{lang === "hi" ? "AI सहायक से नियम पूछें" : "Ask AI Sahayak"}</span>
              </button>

              <div className="flex items-center gap-2">
                {activeModalService.officialPortalUrl !== "#" && (
                  <a
                    href={activeModalService.officialPortalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-3.5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold flex items-center gap-1.5 transition"
                  >
                    <span>{lang === "hi" ? "पोर्टल खोलें" : "Open Portal"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                <button
                  onClick={() => {
                    onSelectServiceForToken(activeModalService);
                    setActiveModalService(null);
                  }}
                  className="text-xs px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{lang === "hi" ? "ग्राहक टोकन बनाएं" : "Create Token"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
