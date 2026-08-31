import React, { useState, useRef, useEffect } from "react";
import { CscService, VleProfile } from "../types";
import {
  Sparkles,
  Send,
  Bot,
  User,
  HelpCircle,
  RefreshCw,
  Copy,
  Check,
  FileText,
  ShieldAlert,
  Lightbulb,
} from "lucide-react";

interface AiAssistantProps {
  vle: VleProfile;
  lang: "hi" | "en";
  initialServiceQuery?: CscService | null;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  vle,
  lang,
  initialServiceQuery,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-welcome",
      sender: "ai",
      text:
        lang === "hi"
          ? `नमस्ते ${vle.vleName || "VLE"} जी! 🙏 मैं **सीएससी सहायक AI** हूँ। आप मुझसे किसी भी सरकारी योजना (PM किसान, आयुष्मान, ई-श्रम), पैन कार्ड नियम, आधार सुधार, ई-डिस्ट्रिक्ट जाति/आय प्रमाण पत्र, AEPS बैंकिंग त्रुटियों या आवश्यक दस्तावेज़ों के बारे में बेझिझक पूछ सकते हैं।`
          : `Hello ${vle.vleName || "VLE"}! I am **CSC Sahayak AI**. Ask me anything about govt scheme eligibility (PM Kisan, Ayushman PM-JAY), PAN card rules, Aadhaar limits, E-District certificates, or AEPS errors.`,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickQuestions = [
    {
      labelHi: "नाबालिग (Minor) पैन कार्ड हेतु नियम व दस्तावेज़",
      labelEn: "Documents for Minor PAN Card",
      prompt: "नाबालिग (18 वर्ष से कम) के पैन कार्ड आवेदन के लिए कौन से दस्तावेज़ चाहिए, हस्ताक्षर किसके होंगे और फोटो आती है या नहीं?",
    },
    {
      labelHi: "आधार कार्ड में जन्मतिथि बदलने की सीमा व दस्तावेज़",
      labelEn: "Aadhaar DOB correction limits & proofs",
      prompt: "आधार कार्ड में जन्मतिथि (DOB) कितनी बार बदल सकते हैं और वैध सहायक दस्तावेज़ (Valid Proof of DOB) कौन से हैं?",
    },
    {
      labelHi: "PM किसान eKYC में बायोमेट्रिक मिसमैच कैसे ठीक करें",
      labelEn: "PM Kisan Biometric Mismatch fix",
      prompt: "PM किसान eKYC करते समय बायोमेट्रिक या आधार नाम मिसमैच होने पर क्या समाधान है?",
    },
    {
      labelHi: "AEPS में ट्रांजैक्शन फेल (500 Error / Fingerprint error) समाधान",
      labelEn: "AEPS Transaction failure troubleshooting",
      prompt: "AEPS में 'Transaction Failed' या 'Biometric data did not match' आने पर VLE को क्या सावधानी रखनी चाहिए?",
    },
    {
      labelHi: "जाति एवं निवास प्रमाण पत्र हेतु स्वघोषणा पत्र नियम",
      labelEn: "Caste & Domicile certificate guidelines",
      prompt: "राज्य ई-डिस्ट्रिक्ट पोर्टल पर जाति और निवास प्रमाण पत्र रिजेक्ट होने के मुख्य कारण और उन्हें रोकने के उपाय बताएं।",
    },
    {
      labelHi: "आयुष्मान भारत में परिवार के नए सदस्य का नाम कैसे जोड़ें",
      labelEn: "Add new family member in Ayushman Card",
      prompt: "आयुष्मान भारत PM-JAY में नए सदस्य का नाम जोड़ने (Add Member) की आधिकारिक प्रक्रिया क्या है?",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialServiceQuery) {
      const q = `मुझे ${initialServiceQuery.name} (${initialServiceQuery.nameHi}) के बारे में संपूर्ण जानकारी, सरकारी पोर्टल नियम, आवश्यक फोटो/सिग्नेचर साइज़ और आवेदन करते समय ध्यान रखने योग्य सावधानियां बताएं।`;
      handleSendMessage(q);
    }
  }, [initialServiceQuery]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          context: {
            vleName: vle.vleName,
            centerName: vle.centerName,
            state: vle.state,
            district: vle.district,
          },
          language: lang,
        }),
      });

      const data = await res.json();
      const replyText =
        data.text ||
        data.fallbackText ||
        "क्षमा करें, AI सहायक से संपर्क नहीं हो पाया। कृपया पुनः प्रयास करें।";

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: "ai",
        text:
          "क्षमा करें, नेटवर्क या सर्वर त्रुटि के कारण जवाब प्राप्त नहीं हो सका। कृपया अपनी इंटरनेट कनेक्टिविटी जांचें या कुछ समय बाद पुनः प्रयास करें।",
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[78vh] overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-blue-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-black shadow-xs">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h3 className="font-bold text-base flex items-center gap-2">
              <span>{lang === "hi" ? "सीएससी सहायक AI मित्र" : "CSC Sahayak AI Assistant"}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold">
                Online
              </span>
            </h3>
            <p className="text-xs text-blue-200">
              {lang === "hi"
                ? "सरकारी योजनाएं, ई-डिस्ट्रिक्ट, पैन, आधार नियम व VLE समस्या निवारण"
                : "Govt schemes, Aadhaar rules, PAN guidelines, and VLE troubleshooting"}
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: "m-init",
                sender: "ai",
                text:
                  lang === "hi"
                    ? "बातचीत रीसेट कर दी गई है। आप कोई भी नया प्रश्न पूछ सकते हैं।"
                    : "Conversation refreshed. Ask any new query regarding CSC schemes.",
                timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
              },
            ])
          }
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-blue-200 hover:text-white transition text-xs flex items-center gap-1 cursor-pointer"
          title="Clear Chat"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{lang === "hi" ? "रीसेट" : "Reset"}</span>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-gray-50/50">
        {/* Quick Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl mb-4">
            <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === "hi" ? "अक्सर पूछे जाने वाले सवाल (क्लिक करें):" : "Frequently Asked CSC Queries:"}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.prompt)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white hover:bg-blue-900 hover:text-white text-gray-700 font-medium border border-gray-200 transition text-left shadow-2xs cursor-pointer"
                >
                  {lang === "hi" ? q.labelHi : q.labelEn}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isAi = msg.sender === "ai";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 max-w-3xl ${
                isAi ? "mr-auto" : "ml-auto flex-row-reverse"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-xs ${
                  isAi ? "bg-blue-900 text-white" : "bg-gray-800 text-amber-300"
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed relative group ${
                  isAi
                    ? "bg-white text-gray-800 border border-gray-200 shadow-xs rounded-tl-none"
                    : "bg-blue-900 text-white shadow-xs rounded-tr-none"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                <div
                  className={`flex items-center justify-between gap-3 mt-2 pt-1 border-t text-[10px] ${
                    isAi ? "border-gray-100 text-gray-400" : "border-blue-800 text-blue-200"
                  }`}
                >
                  <span>{msg.timestamp}</span>

                  {isAi && (
                    <button
                      onClick={() => copyMessage(msg.id, msg.text)}
                      className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1 hover:text-blue-900 cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 max-w-xs mr-auto bg-white p-3.5 rounded-xl rounded-tl-none border border-gray-200 text-gray-500 text-xs shadow-xs">
            <Sparkles className="w-4 h-4 text-blue-900 animate-spin" />
            <span>{lang === "hi" ? "सीएससी सहायक जानकारी तलाश रहा है..." : "CSC Sahayak is researching official guidelines..."}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3.5 bg-white border-t border-gray-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="ai-assistant-input"
            type="text"
            placeholder={
              lang === "hi"
                ? "सरकारी योजना, आवश्यक दस्तावेज़ या पैन/आधार का कोई भी नियम पूछें..."
                : "Ask anything about government schemes, documents, or portal errors..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
          />

          <button
            id="ai-assistant-send-btn"
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-lg bg-blue-900 hover:bg-blue-800 disabled:bg-gray-300 text-white font-bold text-xs sm:text-sm transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === "hi" ? "पूछें" : "Send"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
