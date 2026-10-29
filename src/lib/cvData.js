const STORAGE_KEY = "naija-cv-builder:v1";

export const ACCENTS = [
  { id: "blue", name: "Ocean blue", hex: "#0075de" },
  { id: "green", name: "Palm green", hex: "#15803d" },
  { id: "terracotta", name: "Clay", hex: "#b4532a" },
  { id: "plum", name: "Plum", hex: "#7c3aed" },
  { id: "gold", name: "Ankara gold", hex: "#b7791f" },
  { id: "ink", name: "Midnight", hex: "#1f2937" },
];

export const TEMPLATES = [
  { id: "classic", name: "Classic", note: "Single column, serif headings" },
  { id: "modern", name: "Modern", note: "Coloured sidebar for contact and skills" },
  { id: "minimal", name: "Minimal", note: "Clean sans-serif, generous spacing" },
  { id: "compact", name: "Compact", note: "Two columns, fits lots of skills" },
];

export const uid = () => Math.random().toString(36).slice(2, 10);

export const emptyCv = () => ({
  template: "classic",
  accent: "#0075de",
  personal: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    link: "",
    showDob: false,
    dob: "",
    stateOrigin: "",
    nationality: "",
    summary: "",
  },
  education: [],
  experience: [],
  nysc: { enabled: false, state: "", batch: "", year: "" },
  skills: [],
  languages: [],
  certifications: "",
  referees: [],
});

export const sampleCv = () => ({
  template: "modern",
  accent: "#15803d",
  personal: {
    fullName: "Chidinma Eze",
    title: "Junior Accountant",
    email: "chidinma.eze@example.com",
    phone: "+234 803 555 0142",
    location: "Yaba, Lagos",
    link: "linkedin.com/in/chidinma-eze",
    showDob: false,
    dob: "1999-04-12",
    stateOrigin: "Anambra",
    nationality: "Nigerian",
    summary:
      "Recent Accounting graduate with hands-on experience in bookkeeping, tax returns and month-end reconciliations for small businesses. Detail-driven, quick to learn accounting software, and comfortable working to deadlines.",
  },
  education: [
    {
      id: uid(),
      institution: "University of Lagos",
      qualification: "B.Sc. Accounting",
      course: "Financial Accounting, Auditing, Taxation",
      start: "2019",
      end: "2023",
      grade: "Second Class Upper",
    },
    {
      id: uid(),
      institution: "Federal Government Girls College, Onitsha",
      qualification: "WAEC SSCE",
      course: "Science",
      start: "2013",
      end: "2019",
      grade: "7 credits incl. English and Maths",
    },
  ],
  experience: [
    {
      id: uid(),
      company: "Bright Future Ventures Ltd",
      role: "Accounts Intern",
      location: "Ikeja, Lagos",
      start: "Jun 2023",
      end: "Dec 2023",
      bullets:
        "Prepared monthly bank reconciliations for 12 SME clients\nReduced invoice processing time by 25% with a new tracking sheet\nAssisted with VAT and PAYE returns filed on time",
    },
  ],
  nysc: { enabled: true, state: "Rivers", batch: "2024 Batch B", year: "2024" },
  skills: ["Bookkeeping", "QuickBooks", "Excel", "Tax Filing", "Payroll", "Financial Reporting"],
  languages: [
    { id: uid(), language: "English", level: "Fluent" },
    { id: uid(), language: "Igbo", level: "Native" },
    { id: uid(), language: "Yoruba", level: "Conversational" },
  ],
  certifications: "ACCA Level 1 (Paper F1 passed)\nCertificate in Basic Tax Practice, 2023",
  referees: [
    {
      id: uid(),
      name: "Mr Emeka Nwankwo",
      title: "Senior Accountant",
      organisation: "Bright Future Ventures Ltd",
      phone: "+234 806 555 0199",
      email: "emeka.nwankwo@example.com",
    },
  ],
});

export function loadCv() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...emptyCv(), ...parsed, personal: { ...emptyCv().personal, ...parsed.personal } };
  } catch {
    return null;
  }
}

export function saveCv(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function clearStoredCv() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable: nothing to clear */
  }
}

export function isBlank(data) {
  const p = data.personal;
  return (
    !p.fullName &&
    !p.title &&
    !p.summary &&
    !data.education.length &&
    !data.experience.length &&
    !data.skills.length &&
    !data.languages.length &&
    !data.certifications.trim() &&
    !data.referees.length &&
    !data.nysc.enabled
  );
}

// Only content that has text reaches the preview, so empty sections disappear.
export function previewModel(data) {
  const bullets = (text) =>
    text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  return {
    template: data.template,
    accent: data.accent,
    personal: data.personal,
    education: data.education.filter((e) => e.institution || e.qualification),
    experience: data.experience
      .filter((e) => e.company || e.role)
      .map((e) => ({ ...e, items: bullets(e.bullets || "") })),
    nysc: data.nysc.enabled ? data.nysc : null,
    skills: data.skills,
    languages: data.languages.filter((l) => l.language),
    certifications: bullets(data.certifications),
    referees: data.referees.filter((r) => r.name),
  };
}

export function formatDob(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
