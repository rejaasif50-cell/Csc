import { AffidavitTemplate } from "../types";

export const AFFIDAVIT_TEMPLATES: AffidavitTemplate[] = [
  {
    id: "name-correction",
    title: "Affidavit for Name / Spelling Correction",
    titleHi: "नाम अथवा वर्तनी सुधार हेतु शपथ पत्र",
    category: "Name & Identity",
    description: "Used when there is a minor spelling discrepancy between Aadhaar, 10th mark sheet, or PAN Card.",
    requiredFields: [
      { key: "applicantName", label: "Applicant Name", labelHi: "आवेदक का सही नाम", placeholder: "उदा: राजेश कुमार शर्मा" },
      { key: "fatherName", label: "Father / Husband Name", labelHi: "पिता / पति का नाम", placeholder: "उदा: श्री मदन लाल शर्मा" },
      { key: "address", label: "Full Address", labelHi: "पूरा पता", placeholder: "उदा: ग्राम - रामपुर, पोस्ट - रामपुर, जिला - मेरठ, उ.प्र." },
      { key: "wrongName", label: "Incorrect Name as in Record", labelHi: "गलत नाम (जो दस्तावेज़ में दर्ज है)", placeholder: "उदा: राजेश शर्मा" },
      { key: "correctName", label: "Correct Name to be Used", labelHi: "सही नाम (जो मान्य होना चाहिए)", placeholder: "उदा: राजेश कुमार शर्मा" },
      { key: "documentName", label: "Document Having Discrepancy", labelHi: "दस्तावेज़ का नाम", placeholder: "उदा: 10वीं मार्कशीट / आधार कार्ड" },
    ],
    hindiTemplate: `समक्ष: श्रीमान कार्यपालक दंडाधिकारी / नोटरी पब्लिक

शपथ पत्र (Affidavit)

मैं, {{applicantName}}, पुत्र/पुत्री/पत्नी श्री {{fatherName}}, निवासी: {{address}}, शपथपूर्वक निम्नलिखित बयान करता/करती हूँ:

1. यह कि मैं भारत का/की स्थायी निवासी हूँ एवं उपरोक्त पते पर निवास करता/करती हूँ।
2. यह कि मेरे {{documentName}} में मेरा नाम भूलवश "{{wrongName}}" अंकित हो गया है।
3. यह कि मेरा वास्तविक, सही एवं प्रामाणिक नाम "{{correctName}}" है।
4. यह कि "{{wrongName}}" तथा "{{correctName}}" दोनों एक ही व्यक्ति अर्थात मेरे स्वयं के नाम हैं और इनमें कोई भिन्नता नहीं है।
5. यह कि भविष्य में सभी शासकीय, गैर-शासकीय एवं शैक्षणिक कार्यों में मेरा नाम "{{correctName}}" ही मान्य एवं प्रयुक्त किया जाए।
6. यह कि इस शपथ पत्र में दी गई समस्त जानकारी मेरे ज्ञान एवं विश्वास के अनुसार सत्य एवं सही है।

स्थान: _______________
दिनांक: _______________

हस्ताक्षर शपथकर्ता: _______________

सत्यापन (Verification):
मैं शपथकर्ता सत्यापित करता/करती हूँ कि उपरोक्त पैरा 1 से 6 तक की सभी बातें मेरे निजी ज्ञान में सत्य हैं, इसमें कोई तथ्य छुपाया नहीं गया है।

हस्ताक्षर शपथकर्ता: _______________`,
    englishTemplate: `BEFORE THE EXECUTIVE MAGISTRATE / NOTARY PUBLIC

AFFIDAVIT FOR NAME CORRECTION

I, {{applicantName}}, Son/Daughter/Wife of Shri {{fatherName}}, residing at {{address}}, do hereby solemnly affirm and declare on oath as under:

1. That I am a bona fide citizen of India and permanently residing at the above-mentioned address.
2. That in my {{documentName}}, my name has been erroneously recorded as "{{wrongName}}".
3. That my actual, correct, and true legal name is "{{correctName}}".
4. That both names "{{wrongName}}" and "{{correctName}}" pertain to one and the same person, i.e., myself.
5. That in all future official, governmental, educational, and legal records, my name shall be read and recognized as "{{correctName}}".
6. That the contents of this affidavit are true to the best of my knowledge and belief.

Place: _______________
Date: _______________

DEPONENT (Signature): _______________

VERIFICATION:
Verified at on this day that the contents of above affidavit are true and correct to the best of my knowledge.

DEPONENT (Signature): _______________`,
  },
  {
    id: "income-declaration",
    title: "Self-Declaration for Family Annual Income",
    titleHi: "वार्षिक पारिवारिक आय स्वप्रमाणित घोषणा पत्र",
    category: "Income & Subsidy",
    description: "Self-declaration of family income for Scholarship, E-District, Ration Card, or Ayushman Bharat.",
    requiredFields: [
      { key: "applicantName", label: "Applicant / Guardian Name", labelHi: "आवेदक / मुखिया का नाम", placeholder: "उदा: सुरेश चंद्र" },
      { key: "fatherName", label: "Father's Name", labelHi: "पिता का नाम", placeholder: "उदा: स्व. राम प्रसाद" },
      { key: "address", label: "Full Address", labelHi: "पूरा पता", placeholder: "उदा: वार्ड नं 4, कस्बा दादरी, जिला गौतमबुद्ध नगर" },
      { key: "occupation", label: "Occupation / Source of Income", labelHi: "व्यवसाय / आय का स्रोत", placeholder: "उदा: कृषि / मजदूरी / छोटी दुकान" },
      { key: "annualIncome", label: "Total Annual Income (₹)", labelHi: "कुल वार्षिक आय (रुपये में)", placeholder: "उदा: 48,000/-" },
      { key: "purpose", label: "Purpose of Certificate", labelHi: "प्रमाण पत्र का उद्देश्य", placeholder: "उदा: छात्रवृत्ति आवेदन / राशन कार्ड" },
    ],
    hindiTemplate: `स्वप्रमाणित आय घोषणा पत्र (Self Declaration of Income)

मैं, {{applicantName}}, पुत्र श्री {{fatherName}}, निवासी: {{address}}, घोषणा करता हूँ कि:

1. मेरा मुख्य व्यवसाय "{{occupation}}" है।
2. मेरे परिवार के सभी वैध स्रोतों (कृषि/मजदूरी/व्यवसाय) से होने वाली कुल वार्षिक आय मात्र ₹{{annualIncome}} (रुपये शब्दों में: _______________) है।
3. यह घोषणा पत्र मैं "{{purpose}}" के निमित्त आय प्रमाण पत्र प्राप्त करने हेतु प्रस्तुत कर रहा हूँ।
4. यदि मेरे द्वारा दी गई आय संबंधी सूचना भविष्य में असत्य अथवा भ्रामक पाई जाती है, तो मेरे विरुद्ध विधि सम्मत विधिक कार्रवाई की जा सकती है।

स्थान: _______________
दिनांक: _______________

हस्ताक्षर/अंगूठा निशान आवेदक: _______________
नाम: {{applicantName}}
मोबाइल: _______________`,
    englishTemplate: `SELF-DECLARATION OF ANNUAL FAMILY INCOME

I, {{applicantName}}, Son/Wife of Shri {{fatherName}}, Resident of {{address}}, do hereby solemnly declare as follows:

1. That my primary occupation is "{{occupation}}".
2. That the total annual income of my family from all sources is ₹{{annualIncome}} (in words: _______________ only).
3. That I am submitting this declaration for obtaining an Income Certificate for the purpose of "{{purpose}}".
4. That if any information stated herein is found to be false or misleading at any stage, I shall be liable for appropriate legal action.

Place: _______________
Date: _______________

Signature / Thumb Impression: _______________
Name: {{applicantName}}`,
  },
  {
    id: "gap-year-certificate",
    title: "Affidavit for Gap in Studies (Gap Certificate)",
    titleHi: "अध्ययन अंतराल (गैप ईयर) शपथ पत्र",
    category: "Education",
    description: "Required during college admission, ITI, Polytechnic, or university admission when there is a break in academic years.",
    requiredFields: [
      { key: "applicantName", label: "Student Name", labelHi: "छात्र / छात्रा का नाम", placeholder: "उदा: अमन वर्मा" },
      { key: "fatherName", label: "Father's Name", labelHi: "पिता का नाम", placeholder: "उदा: श्री दिनेश वर्मा" },
      { key: "address", label: "Address", labelHi: "पूरा पता", placeholder: "उदा: शास्त्री नगर, कानपुर" },
      { key: "lastExam", label: "Last Passed Examination", labelHi: "अंतिम उत्तीर्ण परीक्षा", placeholder: "उदा: 12th (इंटरमीडिएट) - वर्ष 2023" },
      { key: "gapPeriod", label: "Gap Period (Years)", labelHi: "गैप का समय (वर्ष)", placeholder: "उदा: 2023 से 2025 (2 वर्ष)" },
      { key: "gapReason", label: "Reason for Gap", labelHi: "गैप का कारण", placeholder: "उदा: प्रतियोगी परीक्षा की तैयारी / पारिवारिक कारण" },
    ],
    hindiTemplate: `समक्ष: प्राचार्य / सक्षम अधिकारी (कॉलेज / विश्वविद्यालय)

शपथ पत्र (गैप ईयर प्रमाण पत्र)

मैं, {{applicantName}}, पुत्र/पुत्री श्री {{fatherName}}, निवासी: {{address}}, शपथपूर्वक कथन करता/करती हूँ:

1. यह कि मैंने अपनी अंतिम शैक्षणिक परीक्षा "{{lastExam}}" नियमित/प्राइवेट रूप से उत्तीर्ण की थी।
2. यह कि इसके उपरांत अवधि "{{gapPeriod}}" के दौरान मैंने किसी भी अन्य शैक्षणिक संस्थान में नियमित प्रवेश नहीं लिया।
3. यह कि उक्त अंतराल (Gap) का मुख्य कारण "{{gapReason}}" था।
4. यह कि उक्त अंतराल अवधि के दौरान मैं किसी भी गैर-कानूनी, असामाजिक या आपराधिक गतिविधि में संलिप्त नहीं रहा/रही हूँ और न ही मेरे विरुद्ध कोई पुलिस प्रकरण दर्ज है।
5. यह कि अब मैं आगामी पाठ्यक्रम में नियमित प्रवेश लेने का/की इच्छुक हूँ।

स्थान: _______________
दिनांक: _______________

हस्ताक्षर शपथकर्ता: _______________`,
    englishTemplate: `BEFORE THE COMPETENT ADMISSION AUTHORITY

AFFIDAVIT FOR STUDY GAP PERIOD

I, {{applicantName}}, Son/Daughter of Shri {{fatherName}}, resident of {{address}}, do hereby solemnly state and affirm as under:

1. That I have passed my {{lastExam}} from a recognized Board/University.
2. That thereafter during the period {{gapPeriod}}, I did not take admission in any regular educational institution.
3. That the reason for the aforesaid gap was "{{gapReason}}".
4. That during this gap period, I was not involved in any unlawful, anti-social, or criminal activities and no criminal case is pending against me.
5. That I am now seeking fresh admission on merit basis.

Place: _______________
Date: _______________

DEPONENT (Signature): _______________`,
  },
];
