import React, { useState } from "react";
import { CSC_SERVICES } from "../data/cscServices";
import { CscService, CustomerApplication } from "../types";
import { X, Search, CheckCircle2, User, Phone, IndianRupee, Plus } from "lucide-react";

interface NewApplicationModalProps {
  initialService?: CscService | null;
  lang: "hi" | "en";
  onClose: () => void;
  onSubmit: (appData: Omit<CustomerApplication, "id" | "tokenNumber" | "createdAt" | "updatedAt">) => void;
}

export const NewApplicationModal: React.FC<NewApplicationModalProps> = ({
  initialService,
  lang,
  onClose,
  onSubmit,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialService ? initialService.id : CSC_SERVICES[0].id
  );
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAadhaarLast4, setCustomerAadhaarLast4] = useState("");
  const [acknowledgementNumber, setAcknowledgementNumber] = useState("");
  const [customGovtFee, setCustomGovtFee] = useState<number>(
    initialService ? initialService.govtFee : CSC_SERVICES[0].govtFee
  );
  const [customCscFee, setCustomCscFee] = useState<number>(
    initialService ? initialService.cscServiceCharge : CSC_SERVICES[0].cscServiceCharge
  );
  const [isPaid, setIsPaid] = useState(true);
  const [paymentMode, setPaymentMode] = useState<"cash" | "upi" | "card">("cash");
  const [notes, setNotes] = useState("");

  const selectedService =
    CSC_SERVICES.find((s) => s.id === selectedServiceId) || CSC_SERVICES[0];

  const handleServiceChange = (id: string) => {
    setSelectedServiceId(id);
    const srv = CSC_SERVICES.find((s) => s.id === id);
    if (srv) {
      setCustomGovtFee(srv.govtFee);
      setCustomCscFee(srv.cscServiceCharge);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerMobile) return;

    onSubmit({
      customerName,
      customerMobile,
      customerAadhaarLast4: customerAadhaarLast4 || undefined,
      serviceId: selectedService.id,
      serviceName: lang === "hi" ? selectedService.nameHi : selectedService.name,
      serviceCategory: selectedService.category,
      status: "pending",
      acknowledgementNumber: acknowledgementNumber || undefined,
      govtFee: customGovtFee,
      cscFee: customCscFee,
      totalAmount: customGovtFee + customCscFee,
      isPaid,
      paymentMode,
      notes: notes || undefined,
      documentsCollected: [],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <h3 className="font-bold text-base">
              {lang === "hi" ? "नया ग्राहक आवेदन / टोकन दर्ज करें" : "New Customer Token / Application"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-blue-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Select Service */}
          <div>
            <label className="font-bold text-gray-700 block mb-1">
              {lang === "hi" ? "सेवा का चयन करें (Service) *" : "Select Service *"}
            </label>
            <select
              value={selectedServiceId}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold bg-white outline-none"
            >
              {CSC_SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {lang === "hi" ? s.nameHi : s.name} ({s.category.replace("_", " ")})
                </option>
              ))}
            </select>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {lang === "hi" ? "ग्राहक का नाम *" : "Citizen / Customer Name *"}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {lang === "hi" ? "मोबाइल नंबर (10 अंक) *" : "Mobile Number (10 digits) *"}
              </label>
              <input
                type="tel"
                required
                pattern="[0-9]{10}"
                placeholder="e.g. 9876543210"
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {lang === "hi" ? "आधार के अंतिम 4 अंक" : "Aadhaar Last 4 Digits"}
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="e.g. 4589"
                value={customerAadhaarLast4}
                onChange={(e) => setCustomerAadhaarLast4(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {lang === "hi" ? "पोर्टल पावती सं. (Ack No.)" : "Portal Ack / Ref No."}
              </label>
              <input
                type="text"
                placeholder="Optional (add later)"
                value={acknowledgementNumber}
                onChange={(e) => setAcknowledgementNumber(e.target.value)}
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              />
            </div>
          </div>

          {/* Pricing breakdown */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              {lang === "hi" ? "शुल्क विवरण (Fee Calculation):" : "Fee Calculation:"}
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] text-gray-500 block mb-0.5">{lang === "hi" ? "सरकारी शुल्क" : "Govt Fee"}</label>
                <div className="flex items-center">
                  <span className="text-xs font-bold text-gray-500 mr-1">₹</span>
                  <input
                    type="number"
                    value={customGovtFee}
                    onChange={(e) => setCustomGovtFee(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg text-xs font-bold bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-gray-500 block mb-0.5">{lang === "hi" ? "VLE सेवा शुल्क" : "CSC Fee"}</label>
                <div className="flex items-center">
                  <span className="text-xs font-bold text-gray-500 mr-1">₹</span>
                  <input
                    type="number"
                    value={customCscFee}
                    onChange={(e) => setCustomCscFee(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-lg text-xs font-bold bg-white text-blue-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-gray-500 block mb-0.5">{lang === "hi" ? "कुल शुल्क" : "Total Bill"}</label>
                <div className="text-sm font-black text-gray-900 pt-1">
                  ₹{customGovtFee + customCscFee}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {lang === "hi" ? "भुगतान स्थिति" : "Payment Status"}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPaid(true)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isPaid ? "bg-emerald-600 text-white" : "bg-white border border-gray-300 text-gray-700"
                    }`}
                  >
                    {lang === "hi" ? "पूर्ण (Paid)" : "Paid"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaid(false)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      !isPaid ? "bg-rose-600 text-white" : "bg-white border border-gray-300 text-gray-700"
                    }`}
                  >
                    {lang === "hi" ? "बाकी (Due)" : "Due"}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  {lang === "hi" ? "माध्यम" : "Mode"}
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white font-medium outline-none"
                >
                  <option value="cash">{lang === "hi" ? "नकद (Cash)" : "Cash"}</option>
                  <option value="upi">{lang === "hi" ? "UPI (GPay/PhonePe)" : "UPI"}</option>
                  <option value="card">{lang === "hi" ? "कार्ड / अन्य" : "Card / Other"}</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              {lang === "hi" ? "अतिरिक्त टिप्पणी (Notes / Remarks)" : "Remarks / Notes"}
            </label>
            <input
              type="text"
              placeholder="e.g. Photo & Aadhaar copy attached"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs cursor-pointer"
            >
              {lang === "hi" ? "रद्द करें" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer"
            >
              {lang === "hi" ? "टोकन व रसीद बनाएं" : "Create Token & Receipt"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
