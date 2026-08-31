import React, { useState } from "react";
import { LedgerEntry, LedgerEntryType, VleProfile } from "../types";
import {
  IndianRupee,
  PlusCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  TrendingUp,
  Download,
  Calendar,
  Wallet,
  Building2,
  Trash2,
} from "lucide-react";

interface CashLedgerProps {
  ledger: LedgerEntry[];
  vle: VleProfile;
  lang: "hi" | "en";
  onAddEntry: (entry: Omit<LedgerEntry, "id" | "createdAt">) => void;
  onDeleteEntry: (id: string) => void;
  onOpenDayEndPrint: () => void;
}

export const CashLedger: React.FC<CashLedgerProps> = ({
  ledger,
  vle,
  lang,
  onAddEntry,
  onDeleteEntry,
  onOpenDayEndPrint,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [entryType, setEntryType] = useState<LedgerEntryType>("income");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState<"cash" | "upi" | "bank">("cash");
  const [category, setCategory] = useState("CSC Service Fee");
  const [aepsCommission, setAepsCommission] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [dateFilter, setDateFilter] = useState<"today" | "all">("today");

  const isToday = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  const filteredEntries = ledger.filter((item) =>
    dateFilter === "today" ? isToday(item.createdAt) : true
  );

  const totalIncome = filteredEntries
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = filteredEntries
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalAepsCashOut = filteredEntries
    .filter((e) => e.type === "aeps_withdrawal")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalAepsCommission = filteredEntries
    .filter((e) => e.type === "aeps_withdrawal" && e.aepsCommission)
    .reduce((sum, e) => sum + (e.aepsCommission || 0), 0);

  const cashInCounter = filteredEntries.reduce((sum, e) => {
    if (e.paymentMode !== "cash") return sum;
    if (e.type === "income") return sum + e.amount;
    if (e.type === "expense") return sum - e.amount;
    if (e.type === "aeps_withdrawal") return sum - e.amount; // Cash given out to customer
    return sum;
  }, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    onAddEntry({
      type: entryType,
      title,
      titleHi: title,
      amount: parseFloat(amount) || 0,
      paymentMode,
      category,
      customerName: customerName || undefined,
      aepsCommission: aepsCommission ? parseFloat(aepsCommission) : undefined,
      notes: notes || undefined,
    });

    // Reset
    setTitle("");
    setAmount("");
    setAepsCommission("");
    setCustomerName("");
    setNotes("");
    setShowAddModal(false);
  };

  const exportCSV = () => {
    const headers = "ID,Type,Title,Amount,PaymentMode,Category,CustomerName,Commission,Date\n";
    const rows = filteredEntries
      .map(
        (e) =>
          `"${e.id}","${e.type}","${e.title}","${e.amount}","${e.paymentMode}","${e.category}","${e.customerName || ""}","${e.aepsCommission || 0}","${e.createdAt}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CSC_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Summary Cards */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-900" />
              <span>{lang === "hi" ? "दैनिक कैश व AEPS बैंकिंग बहीखाता" : "Daily Cash & AEPS Banking Ledger"}</span>
            </h2>
            <p className="text-sm text-gray-600 mt-0.5">
              {lang === "hi"
                ? "दुकान की सेवा आय, AEPS कैश निकासी, ख़र्च एवं काउंटर बैलेंस का संपूर्ण हिसाब।"
                : "Realtime tracking of service revenue, AEPS cash payouts, expenses, and counter cash."}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setDateFilter(dateFilter === "today" ? "all" : "today")}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              <span>{dateFilter === "today" ? (lang === "hi" ? "आज का हिसाब" : "Today") : (lang === "hi" ? "पूरा रिकॉर्ड" : "All Records")}</span>
            </button>

            <button
              id="export-csv-btn"
              onClick={exportCSV}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span>{lang === "hi" ? "CSV डाउनलोड" : "Export CSV"}</span>
            </button>

            <button
              id="print-day-report-btn"
              onClick={onOpenDayEndPrint}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-900 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-blue-900" />
              <span>{lang === "hi" ? "डे-एंड रिपोर्ट प्रिंट" : "Print Day-End"}</span>
            </button>

            <button
              id="add-ledger-entry-btn"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-1.5 text-xs sm:text-sm font-bold rounded-lg bg-blue-900 hover:bg-blue-800 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === "hi" ? "+ नई प्रविष्टि (Entry)" : "+ Add Entry"}</span>
            </button>
          </div>
        </div>

        {/* Ledger KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-gray-100">
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
              {lang === "hi" ? "कुल सेवा आय (Income)" : "Total Income"}
            </span>
            <div className="text-xl font-bold text-emerald-950 mt-0.5">
              ₹{totalIncome.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-emerald-700 font-medium">
              +{totalAepsCommission > 0 ? `₹${totalAepsCommission} AEPS Com.` : "Direct Fees"}
            </span>
          </div>

          <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl">
            <span className="text-[11px] font-semibold text-purple-800 uppercase tracking-wider block">
              {lang === "hi" ? "AEPS कैश वितरण" : "AEPS Cash Given Out"}
            </span>
            <div className="text-xl font-bold text-purple-950 mt-0.5">
              ₹{totalAepsCashOut.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-purple-700 font-medium">
              {lang === "hi" ? "बैंक से प्राप्त / ग्राहक को दिया" : "Disbursed to citizen"}
            </span>
          </div>

          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl">
            <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider block">
              {lang === "hi" ? "कुल दुकान ख़र्च" : "Total Expenses"}
            </span>
            <div className="text-xl font-bold text-rose-950 mt-0.5">
              ₹{totalExpense.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-rose-700 font-medium">
              {lang === "hi" ? "कागज़, इंक, बिजली आदि" : "Paper, Ink, Rent, Tea"}
            </span>
          </div>

          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
            <span className="text-[11px] font-semibold text-blue-900 uppercase tracking-wider block">
              {lang === "hi" ? "काउंटर कैश अनुमान" : "Net Cash in Drawer"}
            </span>
            <div className={`text-xl font-bold mt-0.5 ${cashInCounter >= 0 ? "text-blue-950" : "text-rose-600"}`}>
              ₹{cashInCounter.toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-blue-800 font-medium">
              {lang === "hi" ? "नकदी आवक - नकदी जावक" : "Cash In - Cash Out"}
            </span>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-sm">
            {dateFilter === "today" ? (lang === "hi" ? "आज की सभी प्रविष्टियाँ" : "Today's Ledger Entries") : (lang === "hi" ? "सभी प्रविष्टियाँ" : "All Historical Entries")}
          </h3>
          <span className="text-xs text-gray-500 font-medium">{filteredEntries.length} {lang === "hi" ? "प्रविष्टियाँ" : "entries"}</span>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-10 px-4">
            <p className="text-gray-500 font-medium text-xs sm:text-sm">
              {lang === "hi"
                ? "इस अवधि में कोई प्रविष्टि नहीं है। नया लेन-देन जोड़ने के लिए '+ नई प्रविष्टि' पर क्लिक करें।"
                : "No ledger records found. Click '+ Add Entry' to record cash in/out."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-600 font-semibold text-[11px] uppercase">
                  <th className="py-3 px-4">{lang === "hi" ? "समय व प्रकार" : "Time & Type"}</th>
                  <th className="py-3 px-4">{lang === "hi" ? "विवरण (Title)" : "Description / Category"}</th>
                  <th className="py-3 px-4">{lang === "hi" ? "ग्राहक / संदर्भ" : "Customer / Note"}</th>
                  <th className="py-3 px-4">{lang === "hi" ? "माध्यम" : "Mode"}</th>
                  <th className="py-3 px-4 text-right">{lang === "hi" ? "राशि (Amount)" : "Amount"}</th>
                  <th className="py-3 px-4 text-right">{lang === "hi" ? "हटाएं" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEntries.map((item) => {
                  const isInc = item.type === "income";
                  const isExp = item.type === "expense";
                  const isAeps = item.type === "aeps_withdrawal";

                  const formattedTime = new Date(item.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 ${
                              isInc
                                ? "bg-emerald-100 text-emerald-700"
                                : isAeps
                                ? "bg-purple-100 text-purple-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {isInc ? "+" : isAeps ? "⇄" : "-"}
                          </span>
                          <div>
                            <span className="font-semibold text-gray-800 block text-xs">
                              {isInc
                                ? (lang === "hi" ? "आय (Income)" : "Income")
                                : isAeps
                                ? (lang === "hi" ? "AEPS निकासी" : "AEPS Cash Out")
                                : (lang === "hi" ? "ख़र्च (Expense)" : "Expense")}
                            </span>
                            <span className="text-[11px] text-gray-400">{formattedTime}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-gray-900 block">{item.title}</span>
                        <span className="text-[11px] text-gray-500">{item.category}</span>
                      </td>

                      <td className="py-3 px-4">
                        {item.customerName && (
                          <div className="font-medium text-gray-800">{item.customerName}</div>
                        )}
                        {item.notes && <div className="text-[11px] text-gray-500">{item.notes}</div>}
                        {!item.customerName && !item.notes && <span className="text-gray-400">-</span>}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-700 border border-gray-200">
                          {item.paymentMode}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div
                          className={`font-bold text-sm ${
                            isInc
                              ? "text-emerald-700"
                              : isAeps
                              ? "text-purple-700"
                              : "text-rose-700"
                          }`}
                        >
                          {isInc ? "+" : isAeps ? "⇄" : "-"}₹{item.amount}
                        </div>
                        {item.aepsCommission && (
                          <span className="text-[10px] text-emerald-600 font-bold block">
                            +₹{item.aepsCommission} Comm.
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onDeleteEntry(item.id)}
                          className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {lang === "hi" ? "बहीखाते में नई प्रविष्टि दर्ज करें" : "Add Cash / Banking Entry"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs sm:text-sm">
              {/* Type selector tabs */}
              <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setEntryType("income");
                    setCategory("CSC Service Fee");
                  }}
                  className={`py-1.5 font-bold rounded-md text-xs transition cursor-pointer ${
                    entryType === "income" ? "bg-emerald-600 text-white shadow-xs" : "text-gray-700"
                  }`}
                >
                  {lang === "hi" ? "+ आय (Income)" : "+ Income"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEntryType("aeps_withdrawal");
                    setCategory("AEPS Banking");
                  }}
                  className={`py-1.5 font-bold rounded-md text-xs transition cursor-pointer ${
                    entryType === "aeps_withdrawal" ? "bg-purple-600 text-white shadow-xs" : "text-gray-700"
                  }`}
                >
                  {lang === "hi" ? "⇄ AEPS निकासी" : "⇄ AEPS Out"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEntryType("expense");
                    setCategory("Shop Expense");
                  }}
                  className={`py-1.5 font-bold rounded-md text-xs transition cursor-pointer ${
                    entryType === "expense" ? "bg-rose-600 text-white shadow-xs" : "text-gray-700"
                  }`}
                >
                  {lang === "hi" ? "- ख़र्च (Expense)" : "- Expense"}
                </button>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">
                  {lang === "hi" ? "विवरण / सेवा का नाम *" : "Title / Description *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    entryType === "income"
                      ? "e.g. 5x Photocopy + PAN Form Fee"
                      : entryType === "aeps_withdrawal"
                      ? "e.g. SBI Bank Aadhaar Withdrawal"
                      : "e.g. A4 Paper Box / Printer Ink Refill"
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    {lang === "hi" ? "राशि (₹) *" : "Amount (₹) *"}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 200"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    {lang === "hi" ? "भुगतान माध्यम" : "Payment Mode"}
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="cash">{lang === "hi" ? "नकद (Cash)" : "Cash"}</option>
                    <option value="upi">{lang === "hi" ? "UPI (PhonePe/GPay)" : "UPI"}</option>
                    <option value="bank">{lang === "hi" ? "बैंक / वॉलेट" : "Bank / Wallet"}</option>
                  </select>
                </div>
              </div>

              {entryType === "aeps_withdrawal" && (
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    {lang === "hi" ? "VLE कमीशन कमाई (₹)" : "AEPS Commission Earned (₹)"}
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 5 or 10"
                    value={aepsCommission}
                    onChange={(e) => setAepsCommission(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    {lang === "hi" ? "ग्राहक का नाम" : "Customer Name"}
                  </label>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">
                    {lang === "hi" ? "श्रेणी (Category)" : "Category"}
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs cursor-pointer"
                >
                  {lang === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  {lang === "hi" ? "प्रविष्टि सहेजें" : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
