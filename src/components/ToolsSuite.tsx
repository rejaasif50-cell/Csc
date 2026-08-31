import React, { useState, useRef } from "react";
import { AFFIDAVIT_TEMPLATES } from "../data/affidavits";
import { DEFAULT_RATE_CARD } from "../data/rateCard";
import { SCHEME_CRITERIA } from "../data/schemeCriteria";
import { RateItem, VleProfile } from "../types";
import {
  Camera,
  Calculator,
  FileSignature,
  Printer,
  Copy,
  Download,
  Check,
  CheckCircle2,
  XCircle,
  Sparkles,
  Layers,
  IndianRupee,
  RefreshCw,
} from "lucide-react";

interface ToolsSuiteProps {
  vle: VleProfile;
  lang: "hi" | "en";
}

export const ToolsSuite: React.FC<ToolsSuiteProps> = ({ vle, lang }) => {
  const [activeTool, setActiveTool] = useState<"photo" | "age" | "affidavit" | "ratecard">("photo");

  // --- PHOTO SIZER STATE ---
  const [selectedPreset, setSelectedPreset] = useState<string>("pan_photo");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [processedSizeKb, setProcessedSizeKb] = useState<number | null>(null);
  const [quality, setQuality] = useState<number>(0.85);
  const [customWidth, setCustomWidth] = useState<number>(213);
  const [customHeight, setCustomHeight] = useState<number>(213);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const presets: Record<
    string,
    { name: string; width: number; height: number; maxKb: number; type: "photo" | "signature" }
  > = {
    pan_photo: { name: "UTI/NSDL PAN Photo (213x213 px, <30KB)", width: 213, height: 213, maxKb: 30, type: "photo" },
    pan_sig: { name: "PAN Signature (213x213 px / 600DPI, <10KB)", width: 213, height: 213, maxKb: 10, type: "signature" },
    ssc_photo: { name: "SSC / Police Exam Photo (3.5x4.5cm, 20-50KB)", width: 350, height: 450, maxKb: 50, type: "photo" },
    ssc_sig: { name: "SSC Exam Signature (10-20KB)", width: 300, height: 120, maxKb: 20, type: "signature" },
    edistrict_doc: { name: "State E-District Photo (<50KB)", width: 300, height: 360, maxKb: 50, type: "photo" },
    passport_standard: { name: "Standard Indian Passport (35x45mm)", width: 413, height: 531, maxKb: 100, type: "photo" },
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setImageSrc(src);
      processImage(src, selectedPreset, quality);
    };
    reader.readAsDataURL(file);
  };

  const processImage = (src: string, presetKey: string, q: number) => {
    const preset = presets[presetKey];
    const targetW = preset ? preset.width : customWidth;
    const targetH = preset ? preset.height : customHeight;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw white background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, targetW, targetH);

      // Draw image scaled
      ctx.drawImage(img, 0, 0, targetW, targetH);

      const dataUrl = canvas.toDataURL("image/jpeg", q);
      setProcessedImageUrl(dataUrl);

      // Calculate approx KB
      const head = "data:image/jpeg;base64,";
      const sizeBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
      setProcessedSizeKb(Math.round(sizeBytes / 1024 * 10) / 10);
    };
    img.src = src;
  };

  const handlePresetChange = (key: string) => {
    setSelectedPreset(key);
    if (imageSrc) {
      processImage(imageSrc, key, quality);
    }
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (imageSrc) {
      processImage(imageSrc, selectedPreset, newQ);
    }
  };

  const downloadProcessedImage = () => {
    if (!processedImageUrl) return;
    const a = document.createElement("a");
    a.href = processedImageUrl;
    a.download = `CSC_Resized_${selectedPreset}_${Date.now()}.jpg`;
    a.click();
  };

  // --- AGE CALCULATOR STATE ---
  const [dob, setDob] = useState("2000-01-01");
  const [cutoffDate, setCutoffDate] = useState(new Date().toISOString().slice(0, 10));

  const calculateAge = () => {
    const birth = new Date(dob);
    const target = new Date(cutoffDate);
    if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    return { years, months, days, totalDays };
  };

  const calculatedAge = calculateAge();

  // --- AFFIDAVIT GENERATOR STATE ---
  const [selectedTemplateId, setSelectedTemplateId] = useState(AFFIDAVIT_TEMPLATES[0].id);
  const [affidavitLang, setAffidavitLang] = useState<"hi" | "en">("hi");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const selectedAffidavit = AFFIDAVIT_TEMPLATES.find((t) => t.id === selectedTemplateId) || AFFIDAVIT_TEMPLATES[0];

  const getRenderedAffidavit = () => {
    const rawTemplate = affidavitLang === "hi" ? selectedAffidavit.hindiTemplate : selectedAffidavit.englishTemplate;
    let text = rawTemplate;
    selectedAffidavit.requiredFields.forEach((f) => {
      const val = fieldValues[f.key] || `[${affidavitLang === "hi" ? f.labelHi : f.label}]`;
      text = text.replaceAll(`{{${f.key}}}`, val);
    });
    return text;
  };

  const handleCopyAffidavit = () => {
    navigator.clipboard.writeText(getRenderedAffidavit());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // --- RATE CARD STATE ---
  const [rateItems, setRateItems] = useState<RateItem[]>(DEFAULT_RATE_CARD);

  const updateRateItem = (id: string, newTotal: number) => {
    setRateItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, totalPrice: newTotal, cscCharge: Math.max(0, newTotal - item.govtFee) } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: "photo", labelEn: "Photo & Sig Resizer", labelHi: "फोटो व हस्ताक्षर रिसाइजर", icon: Camera },
          { id: "age", labelEn: "Age & Scheme Checker", labelHi: "उम्र व योजना पात्रता", icon: Calculator },
          { id: "affidavit", labelEn: "Affidavits & Letters", labelHi: "शपथ पत्र व घोषणा पत्र", icon: FileSignature },
          { id: "ratecard", labelEn: "Center Rate Chart", labelHi: "रेट लिस्ट (मूल्य तालिका)", icon: Printer },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id as any)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                activeTool === t.id
                  ? "bg-blue-900 text-white shadow-xs"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{lang === "hi" ? t.labelHi : t.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* --- TOOL 1: PHOTO & SIGNATURE RESIZER --- */}
      {activeTool === "photo" && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-900" />
              <span>{lang === "hi" ? "सरकारी फॉर्म हेतु फोटो व हस्ताक्षर रिसाइजर (KB & Pixel Fixer)" : "Govt Form Photo & Signature Resizer"}</span>
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              {lang === "hi"
                ? "पैन कार्ड (213x213 px 300DPI <30KB), SSC, E-District आदि के लिए तुरंत फोटो को तय साइज़ व KB में बदलें।"
                : "Instantly crop and compress photos & signatures for UTI PAN, SSC, E-District, and Parivahan forms."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Controls */}
            <div className="md:col-span-6 space-y-4">
              {/* Preset Selector */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                  {lang === "hi" ? "सरकारी मानक प्रीसेट चुनें (Select Preset)" : "Select Govt Format Preset"}
                </label>
                <div className="space-y-1.5">
                  {Object.entries(presets).map(([key, item]) => (
                    <button
                      key={key}
                      onClick={() => handlePresetChange(key)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                        selectedPreset === key
                          ? "bg-blue-50 border-blue-300 text-blue-900 font-bold"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span>{item.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-gray-200 font-mono text-gray-600">
                        {item.width}x{item.height}px (Max {item.maxKb}KB)
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Input */}
              <div className="border-2 border-dashed border-blue-200 rounded-xl p-4 text-center bg-blue-50/30">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="photo-upload-input"
                />
                <label
                  htmlFor="photo-upload-input"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition"
                >
                  <Camera className="w-4 h-4" />
                  <span>{lang === "hi" ? "फोटो / हस्ताक्षर अपलोड करें" : "Upload Photo / Signature"}</span>
                </label>
                <p className="text-[11px] text-gray-500 mt-2">JPEG, PNG, WEBP supported</p>
              </div>

              {/* Quality / KB Compression Slider */}
              {imageSrc && (
                <div className="space-y-1.5 p-3.5 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                    <span>{lang === "hi" ? "कंप्रेशन गुणवत्ता (Quality & KB)" : "Compression Quality"}</span>
                    <span className="font-mono text-blue-900">{Math.round(quality * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
                    className="w-full cursor-pointer accent-blue-900"
                  />
                  <p className="text-[10px] text-gray-500">
                    {lang === "hi"
                      ? "KB कम करने के लिए स्लाइडर को बाईं ओर खिसकाएं।"
                      : "Slide left to reduce file size (KB)."}
                  </p>
                </div>
              )}
            </div>

            {/* Preview Box */}
            <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-200 rounded-xl">
              {processedImageUrl ? (
                <div className="text-center space-y-3">
                  <div className="p-2 bg-white rounded-xl shadow-xs border border-gray-200 inline-block max-w-[260px]">
                    <img
                      src={processedImageUrl}
                      alt="Resized Preview"
                      className="max-h-60 mx-auto object-contain rounded"
                    />
                  </div>

                  <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 inline-flex items-center gap-3 text-xs font-semibold">
                    <span className="text-gray-600">
                      Dimensions: <strong className="text-gray-900">{presets[selectedPreset]?.width} × {presets[selectedPreset]?.height} px</strong>
                    </span>
                    <span>•</span>
                    <span className="text-gray-600">
                      File Size:{" "}
                      <strong
                        className={`font-mono ${
                          processedSizeKb && processedSizeKb <= presets[selectedPreset]?.maxKb
                            ? "text-emerald-600 font-bold"
                            : "text-amber-600"
                        }`}
                      >
                        {processedSizeKb} KB
                      </strong>
                    </span>
                  </div>

                  {processedSizeKb && processedSizeKb > presets[selectedPreset]?.maxKb && (
                    <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 font-medium">
                      ⚠️ {lang === "hi" ? "फाइल साइज़ अधिकतम सीमा से अधिक है, कृपया क्वालिटी स्लाइडर कम करें।" : "Size exceeds limit. Lower the quality slider."}
                    </p>
                  )}

                  <div>
                    <button
                      onClick={downloadProcessedImage}
                      className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition flex items-center gap-2 mx-auto cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{lang === "hi" ? "रिसाइज्ड फोटो डाउनलोड करें" : "Download Resized JPEG"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-medium">
                    {lang === "hi" ? "पूर्वावलोकन देखने के लिए कोई फोटो अपलोड करें" : "Upload an image to see the resized preview"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- TOOL 2: AGE & SCHEME ELIGIBILITY CALCULATOR --- */}
      {activeTool === "age" && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-900" />
              <span>{lang === "hi" ? "सरकारी योजना एवं कट-ऑफ आयु कैलकुलेटर" : "Govt Scheme Age & Cutoff Calculator"}</span>
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              {lang === "hi"
                ? "निर्धारित कट-ऑफ तारीख पर सटीक वर्ष, माह व दिन की गणना करें और सरकारी योजनाओं की पात्रता जांचें।"
                : "Calculate exact age as on cutoff date and verify eligibility against major Indian schemes."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Input Form */}
            <div className="md:col-span-5 space-y-4">
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    {lang === "hi" ? "जन्मतिथि (Date of Birth) *" : "Date of Birth *"}
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    {lang === "hi" ? "कट-ऑफ / संदर्भ तारीख (Cutoff Date) *" : "Cutoff / Target Date *"}
                  </label>
                  <input
                    type="date"
                    value={cutoffDate}
                    onChange={(e) => setCutoffDate(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setCutoffDate(new Date().toISOString().slice(0, 10))}
                    className="flex-1 py-1 text-[11px] font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer"
                  >
                    {lang === "hi" ? "आज की तारीख" : "Today"}
                  </button>
                  <button
                    onClick={() => setCutoffDate(`${new Date().getFullYear()}-01-01`)}
                    className="flex-1 py-1 text-[11px] font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer"
                  >
                    1st Jan {new Date().getFullYear()}
                  </button>
                  <button
                    onClick={() => setCutoffDate(`${new Date().getFullYear()}-08-01`)}
                    className="flex-1 py-1 text-[11px] font-semibold bg-white border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer"
                  >
                    1st Aug {new Date().getFullYear()}
                  </button>
                </div>
              </div>

              {/* Result Box */}
              {calculatedAge && (
                <div className="p-5 bg-blue-900 text-white rounded-xl shadow-xs text-center">
                  <span className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold">
                    {lang === "hi" ? "कट-ऑफ तारीख पर कुल आयु" : "Calculated Age"}
                  </span>
                  <div className="text-2xl sm:text-3xl font-black mt-1 text-white">
                    {calculatedAge.years} {lang === "hi" ? "वर्ष" : "Years"},{" "}
                    {calculatedAge.months} {lang === "hi" ? "माह" : "Months"},{" "}
                    {calculatedAge.days} {lang === "hi" ? "दिन" : "Days"}
                  </div>
                  <p className="text-xs text-blue-200 mt-1">
                    Total: <strong className="text-white">{calculatedAge.totalDays.toLocaleString()}</strong> days lived
                  </p>
                </div>
              )}
            </div>

            {/* Scheme Eligibility Checklist */}
            <div className="md:col-span-7 space-y-3">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                {lang === "hi" ? "प्रमुख सरकारी योजनाओं की आयु पात्रता स्थिति" : "Scheme Age Eligibility Status"}
              </h4>

              <div className="space-y-2.5">
                {SCHEME_CRITERIA.map((scheme) => {
                  const userAge = calculatedAge ? calculatedAge.years : 0;
                  const isEligible =
                    calculatedAge &&
                    (scheme.minAge === undefined || userAge >= scheme.minAge) &&
                    (scheme.maxAge === undefined || userAge <= scheme.maxAge);

                  return (
                    <div
                      key={scheme.id}
                      className={`p-3 rounded-lg border transition-all ${
                        isEligible
                          ? "bg-emerald-50/70 border-emerald-300"
                          : "bg-gray-50 border-gray-200 opacity-75"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-xs sm:text-sm">
                              {lang === "hi" ? scheme.nameHi : scheme.name}
                            </span>
                            <span className="text-[10px] text-gray-500 font-medium">
                              (Age: {scheme.minAge ?? 0} to {scheme.maxAge ?? "No limit"})
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-600 mt-0.5">
                            {lang === "hi" ? scheme.benefitsHi : scheme.benefits}
                          </p>
                        </div>

                        <div className="shrink-0">
                          {isEligible ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-xs">
                              <Check className="w-3 h-3" />
                              <span>{lang === "hi" ? "पात्र (Eligible)" : "Eligible"}</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                              {lang === "hi" ? "अपात्र (Ineligible)" : "Ineligible"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TOOL 3: AFFIDAVITS & DECLARATION GENERATOR --- */}
      {activeTool === "affidavit" && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-blue-900" />
                <span>{lang === "hi" ? "शपथ पत्र एवं स्व-घोषणा पत्र निर्माता" : "Affidavits & Self-Declaration Generator"}</span>
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {lang === "hi"
                  ? "नाम सुधार, आय घोषणा, गैप सर्टिफिकेट आदि के लिए तुरंत 1-क्लिक में शपथ पत्र तैयार व प्रिंट करें।"
                  : "Generate ready-to-print Hindi and English legal affidavits for name correction, gap year, and income."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAffidavitLang(affidavitLang === "hi" ? "en" : "hi")}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
              >
                {affidavitLang === "hi" ? "Switch to English" : "हिंदी प्रारूप"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Form Fields */}
            <div className="md:col-span-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  {lang === "hi" ? "शपथ पत्र का प्रकार चुनें *" : "Select Affidavit Type *"}
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                >
                  {AFFIDAVIT_TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {lang === "hi" ? t.titleHi : t.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic input fields for chosen template */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                  {lang === "hi" ? "ग्राहक विवरण भरें:" : "Fill Applicant Details:"}
                </span>

                {selectedAffidavit.requiredFields.map((field) => (
                  <div key={field.key}>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      {affidavitLang === "hi" ? field.labelHi : field.label}
                    </label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={fieldValues[field.key] || ""}
                      onChange={(e) =>
                        setFieldValues({ ...fieldValues, [field.key]: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Live Rendered Template Output */}
            <div className="md:col-span-7 flex flex-col justify-between p-5 bg-gray-50 border border-gray-200 rounded-xl">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                  <span className="text-xs font-bold text-gray-700">
                    {lang === "hi" ? "प्रारूप पूर्वावलोकन (Preview)" : "Draft Preview"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyAffidavit}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 flex items-center gap-1 transition cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? (lang === "hi" ? "कॉपी हो गया!" : "Copied!") : (lang === "hi" ? "टेक्स्ट कॉपी करें" : "Copy Text")}</span>
                    </button>

                    <button
                      onClick={() => {
                        const win = window.open("", "_blank");
                        if (win) {
                          win.document.write(`
                            <html>
                              <head>
                                <title>Affidavit - ${selectedAffidavit.title}</title>
                                <style>
                                  body { font-family: 'Times New Roman', serif; padding: 40px; font-size: 14pt; line-height: 1.8; color: #000; }
                                  pre { font-family: inherit; white-space: pre-wrap; }
                                </style>
                              </head>
                              <body>
                                <pre>${getRenderedAffidavit()}</pre>
                                <script>window.print();</script>
                              </body>
                            </html>
                          `);
                          win.document.close();
                        }
                      }}
                      className="px-3 py-1 text-xs font-bold rounded-lg bg-blue-900 hover:bg-blue-800 text-white flex items-center gap-1 shadow-xs transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>{lang === "hi" ? "प्रिंट करें" : "Print Draft"}</span>
                    </button>
                  </div>
                </div>

                <div className="mt-3 p-4 bg-white border border-gray-200 rounded-lg max-h-96 overflow-y-auto font-serif text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-gray-900">
                  {getRenderedAffidavit()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TOOL 4: CSC CENTER RATE CARD / WALL CHART --- */}
      {activeTool === "ratecard" && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Printer className="w-5 h-5 text-blue-900" />
                <span>{lang === "hi" ? "सीएससी केंद्र मूल्य तालिका (Wall Rate Card Chart)" : "CSC Center Wall Rate Chart"}</span>
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {lang === "hi"
                  ? "दुकान पर लगाने हेतु आधिकारिक व पारदर्शी रेट चार्ट। आप सीधे अपने अनुसार रेट बदल सकते हैं और प्रिंट निकाल सकते हैं।"
                  : "Customizable and printable price chart for display on the CSC center notice board."}
              </p>
            </div>

            <button
              onClick={() => {
                const win = window.open("", "_blank");
                if (win) {
                  win.document.write(`
                    <html>
                      <head>
                        <title>Rate Chart - ${vle.centerName}</title>
                        <style>
                          body { font-family: sans-serif; padding: 24px; color: #111; }
                          .header { text-align: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 16px; }
                          h1 { margin: 0; font-size: 22px; color: #1e3a8a; }
                          p { margin: 4px 0; font-size: 13px; color: #475569; }
                          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
                          th, td { border: 1px solid #cbd5e1; padding: 8px 12px; font-size: 12px; text-align: left; }
                          th { background: #f1f5f9; font-weight: bold; }
                          .price { font-weight: bold; font-size: 14px; text-align: right; color: #1e3a8a; }
                          .footer { margin-top: 20px; text-align: center; font-size: 11px; color: #64748b; }
                        </style>
                      </head>
                      <body>
                        <div class="header">
                          <h1>${vle.centerName || "CSC Digital Seva Kendra"}</h1>
                          <p>VLE: ${vle.vleName} | CSC ID: ${vle.cscId} | Mobile: ${vle.mobile}</p>
                          <p>${vle.address}, ${vle.district}, ${vle.state}</p>
                          <h3 style="margin: 8px 0 0 0; color: #047857;">सरकारी एवं नागरिक सेवा शुल्क सूची (Rate List)</h3>
                        </div>
                        <table>
                          <thead>
                            <tr>
                              <th>क्र.सं.</th>
                              <th>सेवा का नाम (Service Name)</th>
                              <th>श्रेणी</th>
                              <th>इकाई (Unit)</th>
                              <th style="text-align: right;">कुल शुल्क (Total Charge)</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${rateItems
                              .map(
                                (item, idx) => `
                              <tr>
                                <td>${idx + 1}</td>
                                <td><strong>${item.nameHi}</strong><br/><small style="color: #64748b">${item.name}</small></td>
                                <td>${item.category}</td>
                                <td>${item.unit || "प्रति सेवा"}</td>
                                <td class="price">₹${item.totalPrice}</td>
                              </tr>
                            `
                              )
                              .join("")}
                          </tbody>
                        </table>
                        <div class="footer">
                          <p>* सरकारी दिशानिर्देशानुसार पारदर्शी शुल्क व्यवस्था। कृपया प्रत्येक सेवा की पक्की रसीद प्राप्त करें।</p>
                        </div>
                        <script>window.print();</script>
                      </body>
                    </html>
                  `);
                  win.document.close();
                }
              }}
              className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === "hi" ? "रेट चार्ट प्रिंट करें" : "Print Rate Chart"}</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-[11px] font-semibold uppercase text-gray-600">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">{lang === "hi" ? "सेवा का नाम" : "Service Name"}</th>
                  <th className="py-3 px-4">{lang === "hi" ? "श्रेणी" : "Category"}</th>
                  <th className="py-3 px-4">{lang === "hi" ? "इकाई (Unit)" : "Unit"}</th>
                  <th className="py-3 px-4 text-right">{lang === "hi" ? "कुल शुल्क (₹) [संपादित करें]" : "Price (₹) [Editable]"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rateItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-2.5 px-4 text-gray-400 font-mono text-xs">{idx + 1}</td>
                    <td className="py-2.5 px-4">
                      <div className="font-bold text-gray-900">{lang === "hi" ? item.nameHi : item.name}</div>
                      <div className="text-[11px] text-gray-500">{lang === "hi" ? item.name : item.nameHi}</div>
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 font-medium text-gray-700 border border-gray-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-gray-600 text-xs">{item.unit || "Per Item"}</td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <span className="font-bold text-gray-700">₹</span>
                        <input
                          type="number"
                          value={item.totalPrice}
                          onChange={(e) => updateRateItem(item.id, parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-right font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
