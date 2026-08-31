import { RateItem } from "../types";

export const DEFAULT_RATE_CARD: RateItem[] = [
  { id: "r1", name: "Black & White Xerox / Photocopy", nameHi: "काली एवं सफेद फोटोकॉपी", category: "Printing", govtFee: 0, cscCharge: 2, totalPrice: 2, unit: "Per Page (Single)" },
  { id: "r2", name: "B&W Back-to-Back Xerox", nameHi: "दोनों तरफ फोटोकॉपी", category: "Printing", govtFee: 0, cscCharge: 3, totalPrice: 3, unit: "Per Page (Both side)" },
  { id: "r3", name: "Color Printout (Document)", nameHi: "रंगीन प्रिंटआउट (डॉक्यूमेंट)", category: "Printing", govtFee: 0, cscCharge: 10, totalPrice: 10, unit: "Per Page" },
  { id: "r4", name: "Document Lamination (A4 / Aadhar)", nameHi: "लैमिनेशन (A4 / आधार / मार्कशीट)", category: "Printing", govtFee: 0, cscCharge: 20, totalPrice: 20, unit: "Per Item" },
  { id: "r5", name: "Passport Photos (8 Copies)", nameHi: "पासपोर्ट साइज फोटो (8 फोटो)", category: "Photography", govtFee: 0, cscCharge: 50, totalPrice: 50, unit: "Per Set" },
  { id: "r6", name: "PVC Smart Plastic Card Print", nameHi: "पीवीसी स्मार्ट कार्ड प्रिंट (ATM जैसा)", category: "Printing", govtFee: 0, cscCharge: 50, totalPrice: 50, unit: "Per Card" },
  { id: "r7", name: "New PAN Card Application", nameHi: "नया पैन कार्ड आवेदन", category: "Identity", govtFee: 107, cscCharge: 50, totalPrice: 157, unit: "Per Application" },
  { id: "r8", name: "PAN Card Correction", nameHi: "पैन कार्ड सुधार", category: "Identity", govtFee: 107, cscCharge: 70, totalPrice: 177, unit: "Per Application" },
  { id: "r9", name: "Income / Caste / Domicile Certificate", nameHi: "आय / जाति / निवास प्रमाण पत्र", category: "Certificates", govtFee: 30, cscCharge: 50, totalPrice: 80, unit: "Per Certificate" },
  { id: "r10", name: "Ayushman Bharat Golden Card", nameHi: "आयुष्मान गोल्डन कार्ड", category: "Schemes", govtFee: 0, cscCharge: 30, totalPrice: 30, unit: "Per Card" },
  { id: "r11", name: "PM Kisan eKYC Biometric", nameHi: "पीएम किसान eKYC बायोमेट्रिक", category: "Schemes", govtFee: 15, cscCharge: 35, totalPrice: 50, unit: "Per Farmer" },
  { id: "r12", name: "Learner's Driving License (LLR)", nameHi: "लर्निंग ड्राइविंग लाइसेंस आवेदन", category: "Transport", govtFee: 350, cscCharge: 100, totalPrice: 450, unit: "Per License" },
  { id: "r13", name: "Online Job / Exam Form Filling", nameHi: "सरकारी नौकरी / प्रवेश परीक्षा फॉर्म", category: "Recruitment", govtFee: 100, cscCharge: 80, totalPrice: 180, unit: "Per Form + Fee" },
  { id: "r14", name: "AEPS Cash Withdrawal (Upto ₹10,000)", nameHi: "आधार से रुपये निकालना (AEPS)", category: "Banking", govtFee: 0, cscCharge: 10, totalPrice: 10, unit: "Per ₹1,000 / Free" },
  { id: "r15", name: "Electricity Bill Payment", nameHi: "बिजली बिल भुगतान", category: "Bills", govtFee: 0, cscCharge: 10, totalPrice: 10, unit: "Per Bill" },
  { id: "r16", name: "Affidavit Typing on Stamp", nameHi: "शपथ पत्र टाइपिंग (स्टाम्प पर)", category: "Typing", govtFee: 10, cscCharge: 60, totalPrice: 70, unit: "Per Page" },
];
