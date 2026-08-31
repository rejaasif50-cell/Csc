import React, { useState } from "react";
import { CustomerApplication, VleProfile } from "../types";
import { Printer, Download, X, CheckCircle2, QrCode } from "lucide-react";

interface ReceiptModalProps {
  application: CustomerApplication;
  vle: VleProfile;
  lang: "hi" | "en";
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  application,
  vle,
  lang,
  onClose,
}) => {
  const [receiptType, setReceiptType] = useState<"standard" | "thermal">("standard");

  const formattedDate = new Date(application.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = new Date(application.createdAt).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handlePrint = () => {
    const printContent = document.getElementById("csc-receipt-printable-area");
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Receipt - #${application.tokenNumber} - ${application.customerName}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: ${receiptType === "thermal" ? "10px" : "30px"};
                color: #111;
                font-size: ${receiptType === "thermal" ? "11px" : "13px"};
                max-width: ${receiptType === "thermal" ? "320px" : "700px"};
                margin: 0 auto;
              }
              .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 8px; margin-bottom: 10px; }
              .header h2 { margin: 0; font-size: ${receiptType === "thermal" ? "15px" : "18px"}; color: #1e3a8a; }
              .header p { margin: 2px 0; font-size: 11px; }
              .title-badge { font-weight: bold; background: #e2e8f0; padding: 3px 8px; display: inline-block; margin-top: 4px; border-radius: 4px; }
              .meta-grid { width: 100%; margin: 10px 0; }
              .meta-grid td { padding: 3px 0; vertical-align: top; }
              .items-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
              .items-table th, .items-table td { border-bottom: 1px solid #ddd; padding: 6px 4px; text-align: left; }
              .items-table th { background: #f8fafc; font-size: 11px; }
              .total-row td { border-top: 2px solid #000; border-bottom: 2px solid #000; font-weight: bold; font-size: 14px; }
              .footer { margin-top: 15px; border-top: 1px dashed #aaa; padding-top: 8px; text-align: center; font-size: 10px; color: #555; }
              .sig-box { margin-top: 25px; display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base">
              {lang === "hi" ? "डिजिटल ग्राहक सेवा रसीद" : "Official CSC Citizen Receipt"}
            </h3>
            <span className="text-xs bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded">
              #{application.tokenNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-blue-950 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setReceiptType("standard")}
                className={`px-2.5 py-1 rounded cursor-pointer ${receiptType === "standard" ? "bg-blue-800 text-white font-bold" : "text-blue-200"}`}
              >
                A4
              </button>
              <button
                onClick={() => setReceiptType("thermal")}
                className={`px-2.5 py-1 rounded cursor-pointer ${receiptType === "thermal" ? "bg-blue-800 text-white font-bold" : "text-blue-200"}`}
              >
                Thermal (POS)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-blue-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-6 overflow-y-auto bg-gray-100 flex justify-center">
          <div
            id="csc-receipt-printable-area"
            className={`bg-white p-6 rounded-xl border border-gray-300 shadow-xs text-gray-900 ${
              receiptType === "thermal" ? "w-full max-w-[320px] text-xs font-mono" : "w-full text-sm"
            }`}
          >
            {/* Center Brand Header */}
            <div className="text-center border-b-2 border-gray-900 pb-3 mb-3">
              <div className="inline-block bg-blue-900 text-white text-[10px] font-black px-2 py-0.5 rounded mb-1 tracking-widest uppercase">
                Common Services Centre (CSC)
              </div>
              <h2 className="text-lg font-black text-blue-950 uppercase tracking-tight">
                {vle.centerName || "CSC Digital Seva Kendra"}
              </h2>
              <p className="text-xs text-gray-600 font-medium mt-0.5">
                VLE: <strong>{vle.vleName}</strong> | CSC ID: <strong>{vle.cscId}</strong>
              </p>
              <p className="text-[11px] text-gray-500">
                {vle.address}, {vle.district}, {vle.state} - {vle.pincode}
              </p>
              <p className="text-[11px] text-gray-500 font-semibold">
                Mobile: {vle.mobile}
              </p>
              <div className="mt-1">
                <span className="text-[10px] font-bold bg-gray-100 border border-gray-300 px-3 py-0.5 rounded-full uppercase">
                  Payment & Service Acknowledgement
                </span>
              </div>
            </div>

            {/* Metadata Table */}
            <table className="w-full text-xs mb-3 border-collapse">
              <tbody>
                <tr>
                  <td className="text-gray-500 py-1">{lang === "hi" ? "टोकन संख्या:" : "Token No:"}</td>
                  <td className="font-bold text-gray-900 py-1 text-right">#{application.tokenNumber}</td>
                </tr>
                <tr>
                  <td className="text-gray-500 py-1">{lang === "hi" ? "तारीख व समय:" : "Date & Time:"}</td>
                  <td className="font-medium text-gray-800 py-1 text-right">{formattedDate} {formattedTime}</td>
                </tr>
                <tr>
                  <td className="text-gray-500 py-1">{lang === "hi" ? "ग्राहक का नाम:" : "Customer Name:"}</td>
                  <td className="font-bold text-gray-900 py-1 text-right">{application.customerName}</td>
                </tr>
                <tr>
                  <td className="text-gray-500 py-1">{lang === "hi" ? "मोबाइल नंबर:" : "Mobile No:"}</td>
                  <td className="font-medium text-gray-800 py-1 text-right">{application.customerMobile}</td>
                </tr>
                {application.acknowledgementNumber && (
                  <tr>
                    <td className="text-gray-500 py-1">{lang === "hi" ? "पावती / Ack No:" : "Ack / Ref No:"}</td>
                    <td className="font-mono font-bold text-blue-900 py-1 text-right">
                      {application.acknowledgementNumber}
                    </td>
                  </tr>
                )}
                <tr>
                  <td className="text-gray-500 py-1">{lang === "hi" ? "वर्तमान स्थिति:" : "Status:"}</td>
                  <td className="font-bold text-emerald-700 py-1 text-right uppercase">
                    {application.status.replace("_", " ")}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Fee Items Table */}
            <table className="w-full text-xs border-collapse my-3">
              <thead>
                <tr className="border-t border-b border-gray-300 bg-gray-50 font-bold">
                  <th className="py-2 px-1 text-left">{lang === "hi" ? "सेवा विवरण" : "Service Description"}</th>
                  <th className="py-2 px-1 text-right">{lang === "hi" ? "राशि (₹)" : "Amount (₹)"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 px-1 font-semibold text-gray-900">
                    {application.serviceName}
                    <span className="block text-[10px] text-gray-500 font-normal">
                      Govt Fee: ₹{application.govtFee} + VLE Fee: ₹{application.cscFee}
                    </span>
                  </td>
                  <td className="py-2 px-1 text-right font-bold text-gray-900">
                    ₹{application.totalAmount}
                  </td>
                </tr>
                <tr className="border-t-2 border-b-2 border-gray-900 font-black text-sm bg-gray-50">
                  <td className="py-2.5 px-1">{lang === "hi" ? "कुल प्राप्त राशि (Total)" : "Total Paid"}</td>
                  <td className="py-2.5 px-1 text-right font-black text-blue-900">
                    ₹{application.totalAmount}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex items-center justify-between text-xs my-2">
              <span className="text-gray-500">{lang === "hi" ? "भुगतान माध्यम:" : "Payment Mode:"}</span>
              <span className="font-bold text-gray-800 uppercase">
                {application.paymentMode} ({application.isPaid ? "PAID" : "DUE"})
              </span>
            </div>

            {/* Signatures & Notice */}
            <div className="mt-6 pt-3 border-t border-dashed border-gray-300 flex items-center justify-between text-[10px] text-gray-500">
              <div>
                <p>Authorized VLE Seal / Signature</p>
                <div className="h-8"></div>
                <p className="font-semibold text-gray-800">({vle.vleName})</p>
              </div>

              <div className="text-right">
                <p>Citizen Signature</p>
                <div className="h-8"></div>
                <p className="font-semibold text-gray-800">({application.customerName})</p>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-gray-200 text-center text-[9px] text-gray-400 leading-tight">
              * This is a computerized acknowledgement receipt issued by Authorized CSC Digital Seva Kendra.
              Save this token/ack number for tracking status.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs cursor-pointer"
          >
            {lang === "hi" ? "बंद करें" : "Close"}
          </button>

          <button
            id="receipt-print-btn"
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{lang === "hi" ? "रसीद प्रिंट करें (Print)" : "Print Official Receipt"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
