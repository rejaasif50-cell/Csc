import React, { useState } from "react";
import { CustomerApplication, ApplicationStatus, VleProfile } from "../types";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Printer,
  Trash2,
  Edit,
  Phone,
  FileCheck,
  AlertCircle,
  IndianRupee,
  Share2,
  ExternalLink,
  MessageCircle,
} from "lucide-react";

interface CustomerTrackerProps {
  applications: CustomerApplication[];
  vle: VleProfile;
  lang: "hi" | "en";
  onUpdateStatus: (id: string, status: ApplicationStatus, ackNo?: string) => void;
  onDeleteApplication: (id: string) => void;
  onOpenReceipt: (app: CustomerApplication) => void;
  onOpenNewToken: () => void;
}

export const CustomerTracker: React.FC<CustomerTrackerProps> = ({
  applications,
  vle,
  lang,
  onUpdateStatus,
  onDeleteApplication,
  onOpenReceipt,
  onOpenNewToken,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAppForEdit, setSelectedAppForEdit] = useState<CustomerApplication | null>(null);
  const [ackInput, setAckInput] = useState("");

  const statusConfig: Record<
    ApplicationStatus,
    { labelEn: string; labelHi: string; color: string; badgeColor: string }
  > = {
    pending: {
      labelEn: "Pending",
      labelHi: "लंबित (Pending)",
      color: "text-amber-700 bg-amber-50 border-amber-200",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    },
    in_progress: {
      labelEn: "In Progress",
      labelHi: "प्रगति पर (In Progress)",
      color: "text-blue-700 bg-blue-50 border-blue-200",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    },
    submitted: {
      labelEn: "Submitted to Portal",
      labelHi: "पोर्टल पर जमा (Submitted)",
      color: "text-purple-700 bg-purple-50 border-purple-200",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    },
    ready: {
      labelEn: "Ready for Delivery",
      labelHi: "वितरण हेतु तैयार (Ready)",
      color: "text-cyan-700 bg-cyan-50 border-cyan-200",
      badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-300",
    },
    delivered: {
      labelEn: "Delivered to Citizen",
      labelHi: "ग्राहक को सौंपा गया (Delivered)",
      color: "text-emerald-700 bg-emerald-50 border-emerald-200",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },
    rejected: {
      labelEn: "Rejected / Defective",
      labelHi: "त्रुटिपूर्ण / निरस्त (Rejected)",
      color: "text-rose-700 bg-rose-50 border-rose-200",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
    },
  };

  const filteredApps = applications.filter((app) => {
    const matchesStatus =
      statusFilter === "all" || app.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesStatus;

    const matchesSearch =
      app.customerName.toLowerCase().includes(query) ||
      app.customerMobile.includes(query) ||
      app.serviceName.toLowerCase().includes(query) ||
      (app.acknowledgementNumber && app.acknowledgementNumber.toLowerCase().includes(query)) ||
      `token-${app.tokenNumber}`.includes(query) ||
      `#${app.tokenNumber}`.includes(query);

    return matchesStatus && matchesSearch;
  });

  const sendWhatsAppNotification = (app: CustomerApplication) => {
    const cleanMobile = app.customerMobile.replace(/\D/g, "");
    const formattedMobile = cleanMobile.length === 10 ? `91${cleanMobile}` : cleanMobile;

    let message = "";
    if (lang === "hi") {
      message = `*${vle.centerName || "CSC Digital Seva Kendra"}*\n\n` +
        `नमस्ते *${app.customerName}* जी,\n` +
        `आपके *${app.serviceName}* का आवेदन हमारे CSC केंद्र द्वारा दर्ज कर लिया गया है।\n\n` +
        `📌 *टोकन नंबर:* #${app.tokenNumber}\n` +
        `📌 *वर्तमान स्थिति:* ${statusConfig[app.status].labelHi}\n` +
        (app.acknowledgementNumber ? `📌 *पावती/Ack No:* ${app.acknowledgementNumber}\n` : "") +
        `📌 *कुल राशि:* ₹${app.totalAmount} (${app.isPaid ? "भुगतान पूर्ण" : "बाकी"})\n\n` +
        `किसी भी जानकारी हेतु संपर्क करें: ${vle.mobile}\n` +
        `_धन्यवाद! आपका दिन शुभ हो।_`;
    } else {
      message = `*${vle.centerName || "CSC Digital Seva Kendra"}*\n\n` +
        `Dear *${app.customerName}*,\n` +
        `Your request for *${app.serviceName}* has been updated at our CSC Center.\n\n` +
        `📌 *Token No:* #${app.tokenNumber}\n` +
        `📌 *Status:* ${statusConfig[app.status].labelEn}\n` +
        (app.acknowledgementNumber ? `📌 *Ack/Ref No:* ${app.acknowledgementNumber}\n` : "") +
        `📌 *Total Amount:* ₹${app.totalAmount} (${app.isPaid ? "Paid" : "Due"})\n\n` +
        `For queries, contact: ${vle.mobile}\n` +
        `_Thank you!_`;
    }

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedMobile}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-blue-900" />
              <span>{lang === "hi" ? "ग्राहक टोकन व आवेदन ट्रैकर" : "Customer Applications & Token Tracker"}</span>
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              {lang === "hi"
                ? "दैनिक आवेदनों की स्थिति ट्रैक करें, WhatsApp पावती भेजें एवं डिजिटल रसीद प्रिंट करें।"
                : "Manage status lifecycle, send WhatsApp alerts, and generate instant printable receipts."}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="tracker-new-token-btn"
              onClick={onOpenNewToken}
              className="bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>+</span>
              <span>{lang === "hi" ? "नया टोकन जोड़ें" : "New Application"}</span>
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="tracker-search-input"
              type="text"
              placeholder={lang === "hi" ? "नाम, मोबाइल, Ack नं या टोकन खोजें..." : "Search by name, mobile, ack no, token..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
            />
          </div>

          <div className="md:col-span-7 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: "all", labelEn: "All", labelHi: "सभी", count: applications.length },
              { id: "pending", labelEn: "Pending", labelHi: "लंबित", count: applications.filter(a => a.status === "pending").length },
              { id: "in_progress", labelEn: "In Progress", labelHi: "प्रगतिरत", count: applications.filter(a => a.status === "in_progress").length },
              { id: "submitted", labelEn: "Submitted", labelHi: "जमा", count: applications.filter(a => a.status === "submitted").length },
              { id: "ready", labelEn: "Ready", labelHi: "तैयार", count: applications.filter(a => a.status === "ready").length },
              { id: "delivered", labelEn: "Delivered", labelHi: "वितरित", count: applications.filter(a => a.status === "delivered").length },
            ].map((tab) => (
              <button
                key={tab.id}
                id={`filter-tab-${tab.id}`}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1 cursor-pointer ${
                  statusFilter === tab.id
                    ? "bg-blue-900 text-white shadow-xs"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                <span>{lang === "hi" ? tab.labelHi : tab.labelEn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === tab.id ? "bg-blue-800 text-white" : "bg-gray-200 text-gray-700"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications Table / Cards */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {filteredApps.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-gray-500 font-medium">
              {lang === "hi"
                ? "कोई आवेदन रिकॉर्ड नहीं मिला। नया आवेदन जोड़ने के लिए ऊपर '+ नया टोकन जोड़ें' पर क्लिक करें।"
                : "No customer records found matching the filter criteria."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">{lang === "hi" ? "टोकन व तारीख" : "Token & Date"}</th>
                  <th className="py-3.5 px-4">{lang === "hi" ? "ग्राहक विवरण" : "Customer Details"}</th>
                  <th className="py-3.5 px-4">{lang === "hi" ? "सेवा का नाम" : "Service Name"}</th>
                  <th className="py-3.5 px-4">{lang === "hi" ? "स्थिति (Status)" : "Current Status"}</th>
                  <th className="py-3.5 px-4">{lang === "hi" ? "शुल्क व भुगतान" : "Fee & Payment"}</th>
                  <th className="py-3.5 px-4 text-right">{lang === "hi" ? "कार्यवाहियाँ" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApps.map((app) => {
                  const statusInfo = statusConfig[app.status];
                  const formattedDate = new Date(app.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={app.id}
                      id={`app-row-${app.id}`}
                      className="hover:bg-gray-50/80 transition"
                    >
                      {/* Token & Date */}
                      <td className="py-3 px-4 align-top">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-md bg-blue-50 text-blue-900 font-black text-xs flex items-center justify-center border border-blue-200 shrink-0">
                            #{app.tokenNumber}
                          </span>
                          <div>
                            <span className="text-[11px] text-gray-500 block">{formattedDate}</span>
                            {app.acknowledgementNumber && (
                              <span className="text-[11px] font-mono text-blue-900 font-medium block">
                                Ack: {app.acknowledgementNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Customer Details */}
                      <td className="py-3 px-4 align-top">
                        <div className="font-bold text-gray-900">{app.customerName}</div>
                        <div className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span>{app.customerMobile}</span>
                        </div>
                        {app.customerAadhaarLast4 && (
                          <div className="text-[11px] text-gray-500 font-mono">
                            Aadhaar: **** {app.customerAadhaarLast4}
                          </div>
                        )}
                      </td>

                      {/* Service Name */}
                      <td className="py-3 px-4 align-top">
                        <div className="font-semibold text-gray-800">{app.serviceName}</div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider block mt-0.5">
                          {app.serviceCategory.replace("_", " ")}
                        </span>
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3 px-4 align-top">
                        <select
                          id={`status-select-${app.id}`}
                          value={app.status}
                          onChange={(e) =>
                            onUpdateStatus(app.id, e.target.value as ApplicationStatus)
                          }
                          className={`text-xs font-bold px-2.5 py-1 rounded-md border outline-none cursor-pointer ${statusInfo.badgeColor}`}
                        >
                          <option value="pending">
                            {lang === "hi" ? "लंबित (Pending)" : "Pending"}
                          </option>
                          <option value="in_progress">
                            {lang === "hi" ? "प्रगति पर (In Progress)" : "In Progress"}
                          </option>
                          <option value="submitted">
                            {lang === "hi" ? "पोर्टल पर जमा (Submitted)" : "Submitted to Portal"}
                          </option>
                          <option value="ready">
                            {lang === "hi" ? "वितरण हेतु तैयार (Ready)" : "Ready for Delivery"}
                          </option>
                          <option value="delivered">
                            {lang === "hi" ? "वितरित (Delivered)" : "Delivered"}
                          </option>
                          <option value="rejected">
                            {lang === "hi" ? "त्रुटिपूर्ण (Rejected)" : "Rejected"}
                          </option>
                        </select>
                      </td>

                      {/* Fee & Payment */}
                      <td className="py-3 px-4 align-top">
                        <div className="font-bold text-gray-900">₹{app.totalAmount}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              app.isPaid
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {app.isPaid ? (lang === "hi" ? "सफल" : "Paid") : (lang === "hi" ? "बाकी" : "Due")}
                          </span>
                          <span className="text-[10px] text-gray-500 uppercase">
                            ({app.paymentMode})
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* WhatsApp Alert */}
                          <button
                            id={`btn-wa-${app.id}`}
                            onClick={() => sendWhatsAppNotification(app)}
                            className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md border border-emerald-200 transition cursor-pointer"
                            title="Send WhatsApp Update"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>

                          {/* Print Receipt */}
                          <button
                            id={`btn-print-${app.id}`}
                            onClick={() => onOpenReceipt(app)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-md border border-blue-200 transition cursor-pointer"
                            title="Print Customer Receipt"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {/* Edit Ack Number */}
                          <button
                            id={`btn-edit-ack-${app.id}`}
                            onClick={() => {
                              setSelectedAppForEdit(app);
                              setAckInput(app.acknowledgementNumber || "");
                            }}
                            className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition cursor-pointer"
                            title="Edit Reference / Ack No"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            id={`btn-delete-${app.id}`}
                            onClick={() => {
                              if (window.confirm(lang === "hi" ? "क्या आप इस रिकॉर्ड को हटाना चाहते हैं?" : "Delete this customer entry?")) {
                                onDeleteApplication(app.id);
                              }
                            }}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-md transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Ack Number Modal */}
      {selectedAppForEdit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 p-6 space-y-4">
            <h3 className="font-bold text-gray-900 text-base">
              {lang === "hi" ? "पावती / संदर्भ संख्या दर्ज करें" : "Update Acknowledgement / Reference Number"}
            </h3>
            <p className="text-xs text-gray-600">
              Customer: <strong>{selectedAppForEdit.customerName}</strong> ({selectedAppForEdit.serviceName})
            </p>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                {lang === "hi" ? "आधिकारिक पोर्टल पावती संख्या (Ack / Application No)" : "Official Portal Ack / Reference No"}
              </label>
              <input
                type="text"
                value={ackInput}
                onChange={(e) => setAckInput(e.target.value)}
                placeholder="e.g. U-123456789 or 25010004928"
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedAppForEdit(null)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
              >
                {lang === "hi" ? "रद्द करें" : "Cancel"}
              </button>
              <button
                onClick={() => {
                  onUpdateStatus(selectedAppForEdit.id, selectedAppForEdit.status, ackInput);
                  setSelectedAppForEdit(null);
                }}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-900 hover:bg-blue-800 text-white shadow-xs cursor-pointer"
              >
                {lang === "hi" ? "सहेजें" : "Save Number"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
