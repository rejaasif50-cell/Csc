import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "CSC Digital Seva Backend" });
});

// Gemini CSC Assistant API endpoint with robust retry and fallback handling
app.post("/api/gemini/assistant", async (req, res) => {
  try {
    const { prompt, context, language = "hi" } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getAi();
    const systemInstruction = `You are "CSC Sahayak AI" (सीएससी सहायक मित्र), an expert virtual consultant for Common Services Centre (CSC / जन सेवा केंद्र / Digital Seva Kendra) Village Level Entrepreneurs (VLEs) and Indian citizens in 2025/2026.
You have comprehensive, accurate knowledge of Indian government schemes, e-governance services, state and central portals:
1. G2C Schemes: PM Kisan Samman Nidhi, Ayushman Bharat PM-JAY (Golden Card), PM Awas Yojana, E-Shram, Ladli Behna / Subhadra Yojana / State welfare schemes, Ration Card (NFSA), Pension schemes (Old Age, Widow, Divyang, Atal Pension APY, PM-SYM).
2. Identity & Certificates: Aadhaar (UIDAI update rules, biometric locks, Child Aadhaar, mobile link, POA/POI list), PAN Card (Form 49A, Form 49AA, PAN correction CSF, Minor PAN, e-PAN instant, NSDL/UTIITSL), Voter ID (Form 6, 7, 8 on NVSP/ECI), Caste (SC/ST/OBC/EWS), Income & Domicile / Niwas Praman Patra (State e-Districts like UP eDistrict, RTPS Bihar, Jharsewa Jharkhand, MP eDistrict, MahaOnline, etc.), Driving License & Sarathi Parivahan (LL, DL, Renewal, Address change), Passport Seva.
3. Banking & Digital Seva: AEPS (Aadhaar Enabled Payment System errors like 500/Biometric mismatch/Transaction failed, limits), DMT (Domestic Money Transfer), PMJDY, Micro-ATM, BBPS utility bill payments, Fastag, CSC Academy (CCC, PMGDISHA, NIELIT, Olympiad).
4. Official rules: Always provide exact document checklists, official websites (e.g. pmkisan.gov.in, uidai.gov.in, pan.utiitsl.com, onlineservices.nsdl.com, pmjay.gov.in, parivahan.gov.in), fee structures (Govt fee vs recommended VLE charge), step-by-step application advice, and common rejection reasons to avoid.

Tone: Professional, helpful, respectful, clear, structured with bullet points.
Support bilingual replies: Respond in natural Hinglish or clear Hindi/English as preferred by the user query.`;

    const fullPrompt = context
      ? `User Context: ${JSON.stringify(context)}\n\nQuery: ${prompt}`
      : prompt;

    // List of models to try in order of preference
    const modelsToTry = [
      "gemini-3.7-flash",
      "gemini-3.1-flash-lite",
      "gemini-flash-latest"
    ];

    let generatedText: string | null = null;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: fullPrompt,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });

          if (response && response.text) {
            generatedText = response.text;
            break;
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`Attempt ${attempt + 1} with model ${modelName} failed:`, err?.message || err);
          // Wait 500ms before retry on same model if transient 503/429
          if (attempt === 0) {
            await new Promise((resolve) => setTimeout(resolve, 600));
          }
        }
      }

      if (generatedText) {
        break;
      }
    }

    if (generatedText) {
      return res.json({ text: generatedText });
    }

    console.error("All Gemini models exhausted. Error:", lastError);

    // Contextual fallback response for common CSC queries
    const pLower = prompt.toLowerCase();
    let fallbackKnowledge = "";

    if (pLower.includes("pan") || pLower.includes("पैन")) {
      fallbackKnowledge = `📋 **पैन कार्ड (PAN Card - NSDL / UTIITSL) दिशा-निर्देश:**\n- **पोर्टल:** UTIITSL / NSDL Portal (Digital Seva)\n- **आवश्यक दस्तावेज़:** आधार कार्ड (पहचान, पता व जन्मतिथि प्रमाण हेतु), 2 पासपोर्ट फोटो, हस्ताक्षर।\n- **सरकारी शुल्क:** ₹107 (Physical PAN) / ₹72 (e-PAN)\n- **फोटो साइज़:** 213x213 px, 300 DPI, <30 KB\n- **हस्ताक्षर साइज़:** 400x200 px, 600 DPI, <60 KB\n- **सलाह:** यदि आधार में नाम या जन्मतिथि गलत है तो पहले आधार सुधार करवाएं।`;
    } else if (pLower.includes("kisan") || pLower.includes("किसान")) {
      fallbackKnowledge = `🌾 **PM किसान सम्मान निधि (PM Kisan e-KYC & New Registration):**\n- **पोर्टल:** pmkisan.gov.in (CSC Login)\n- **आवश्यक दस्तावेज़:** आधार कार्ड, बैंक पासबुक (Aadhaar Seeded / NPCI Linked), खतौनी / Land Mutation Record, राशन कार्ड नंबर।\n- **e-KYC प्रक्रिया:** VLE बायोमेट्रिक डिवाइस (Mantra/Morpho) से OTP या फिंगरप्रिंट e-KYC करें।\n- **महत्वपूर्ण:** यदि किस्त रुकी हुई है तो DBT / NPCI आधार सीडिंग स्टेटस ज़रूर चेक करें।`;
    } else if (pLower.includes("ayushman") || pLower.includes("आयुष्मान") || pLower.includes("golden card")) {
      fallbackKnowledge = `🏥 **आयुष्मान भारत (PM-JAY Golden Card):**\n- **पोर्टल:** beneficiary.nha.gov.in / setu.pmjay.gov.in\n- **पात्रता:** SECC 2011 सूची / राशन कार्ड / मुख्यमंत्री योजना सूची।\n- **आवश्यक दस्तावेज़:** राशन कार्ड या PM पत्र, आधार कार्ड, आधार लिंक मोबाइल।\n- **लाभ:** प्रति परिवार प्रति वर्ष ₹5 लाख तक का निशुल्क इलाज।`;
    } else if (pLower.includes("aeps") || pLower.includes("पैसे") || pLower.includes("निकासी")) {
      fallbackKnowledge = `🏧 **AEPS आधार बैंकिंग समस्या समाधान:**\n- **दैनिक सीमा:** अधिकांश बैंक एक दिन में अधिकतम ₹10,000 की निकासी की अनुमति देते हैं।\n- **Error 500 / Timeout:** बैंक सर्वर डाउन होने पर 30 मिनट प्रतीक्षा करें।\n- **Biometric Mismatch:** बायोमेट्रिक स्कैनर लेंस साफ करें, उंगली सही दबाव से रखवाएं।\n- **2FA अनिवार्य:** VLE को हर 24 घंटे में और प्रत्येक निकासी से पहले अपना फिंगरप्रिंट प्रमाणित करना अनिवार्य है।`;
    } else {
      fallbackKnowledge = `📌 **सीएससी सहायक सूचना:**\n- सरकारी फॉर्म और सेवाओं के लिए आवश्यक दस्तावेज़, शुल्क व पोर्टल लिंक हेतु ऐप के **"Services Catalog (सेवा सूची)"** और **"Quick Portals (पोर्टल लॉन्चर)"** का उपयोग करें।\n- फोटो/हस्ताक्षर रिसाइज़ करने के लिए **"Tools Suite (फोटो रिसाइजर)"** का उपयोग करें।`;
    }

    return res.json({
      text: fallbackKnowledge,
      isFallback: true,
    });
  } catch (error: any) {
    console.error("Gemini API Fatal Error:", error);
    return res.status(200).json({
      text: "वर्तमान में AI सर्वर पर अस्थायी लोड है। कृपया कुछ पलों बाद पुनः प्रश्न पूछें या सेवाओं की सूची में विस्तृत दिशा-निर्देश देखें।",
      isFallback: true,
    });
  }
});

// Vite & Static serving setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CSC Portal Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
