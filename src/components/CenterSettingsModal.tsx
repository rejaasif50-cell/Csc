import React, { useState } from "react";
import { VleProfile } from "../types";
import { X, Save, Building2, User, Phone, MapPin, CreditCard, ShieldCheck } from "lucide-react";

interface CenterSettingsModalProps {
  vle: VleProfile;
  lang: "hi" | "en";
  onClose: () => void;
  onSave: (updated: VleProfile) => void;
}

export const CenterSettingsModal: React.FC<CenterSettingsModalProps> = ({
  vle,
  lang,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<VleProfile>({ ...vle });

  const handleChange = (field: keyof VleProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">
              {lang === "hi" ? "सीएससी केंद्र एवं VLE प्रोफाइल सेटिंग्स" : "CSC Center & VLE Profile Settings"}
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
          <div>
            <label className="font-bold text-gray-700 block mb-1">
              {lang === "hi" ? "सीएससी केंद्र का नाम (Center Name) *" : "Center Name *"}
            </label>
            <input
              type="text"
              required
              value={formData.centerName}
              onChange={(e) => handleChange("centerName", e.target.value)}
              placeholder="e.g. Shri Krishna Digital Seva Kendra"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {lang === "hi" ? "VLE संचालक का नाम *" : "VLE Operator Name *"}
              </label>
              <input
                type="text"
                required
                value={formData.vleName}
                onChange={(e) => handleChange("vleName", e.target.value)}
                placeholder="e.g. Amit Sharma"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {lang === "hi" ? "सीएससी आईडी (CSC ID) *" : "CSC ID (12 Digits) *"}
              </label>
              <input
                type="text"
                required
                value={formData.cscId}
                onChange={(e) => handleChange("cscId", e.target.value)}
                placeholder="e.g. 123456789012"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono font-medium outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {lang === "hi" ? "मोबाइल नंबर *" : "Mobile Number *"}
              </label>
              <input
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) => handleChange("mobile", e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {lang === "hi" ? "ईमेल आईडी" : "Email ID"}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="e.g. csc.center@gmail.com"
                className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              {lang === "hi" ? "दुकान / केंद्र का पूरा पता *" : "Center Address *"}
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="e.g. Main Market, Near Bus Stand, Rampur"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {lang === "hi" ? "ज़िला (District)" : "District"}
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => handleChange("district", e.target.value)}
                placeholder="e.g. Varanasi"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {lang === "hi" ? "राज्य (State)" : "State"}
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
                placeholder="e.g. Uttar Pradesh"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">
                {lang === "hi" ? "पिन कोड" : "Pincode"}
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleChange("pincode", e.target.value)}
                placeholder="e.g. 221001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-700 block mb-1">
              {lang === "hi" ? "दुकान का UPI आईडी (रसीद व पेमेंट हेतु)" : "Center UPI ID for Digital Payments"}
            </label>
            <input
              type="text"
              value={formData.upiId || ""}
              onChange={(e) => handleChange("upiId", e.target.value)}
              placeholder="e.g. vle.csc@upi or 9876543210@paytm"
              className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono outline-none"
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
              className="px-5 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{lang === "hi" ? "सेटिंग्स सहेजें" : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
