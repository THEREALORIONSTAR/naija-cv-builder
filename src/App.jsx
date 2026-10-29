import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import CvForm from "./components/CvForm.jsx";
import CvTemplates from "./components/CvTemplates.jsx";
import { ACCENTS, TEMPLATES, emptyCv, sampleCv, loadCv, saveCv, clearStoredCv, isBlank, previewModel } from "./lib/cvData.js";

const SPRING = { type: "spring", stiffness: 420, damping: 36 };

function useData() {
  const [data, setData] = useState(() => loadCv() ?? emptyCv());
  const [savedAt, setSavedAt] = useState(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (saveCv(data)) setSavedAt(Date.now());
  }, [data]);

  return [data, setData, savedAt];
}

function usePreviewScale(ref) {
  const [scale, setScale] = useState(0.6);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const available = el.clientWidth - 32;
      const sheetPx = (210 / 25.4) * 96;
      setScale(Math.min(1, available / sheetPx));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return scale;
}

function SavedIndicator({ savedAt }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-ink-muted" role="status" aria-live="polite">
      <span className="h-2 w-2 rounded-full bg-emerald-600" aria-hidden="true" />
      {savedAt ? "Saved on this device" : "Nothing saved yet"}
    </span>
  );
}

function Tip() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
      <strong className="font-semibold">Tip:</strong> Keep it to 1 to 2 pages. Use action verbs in your achievements. Never include your bank details or NIN on a CV.
    </div>
  );
}

function HowToUse() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const steps = [
    'Fill in your details, or tap "Load sample" to try it out first.',
    "Pick a template and an accent colour.",
    'Check the live preview. On mobile, use the "Preview" tab.',
    'Tap "Download as PDF", then choose "Save as PDF" in the print window.',
  ];
  return (
    <div className="how-to-card rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="how-to-body"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl px-5 py-3 text-left focus-visible:outline-2 focus-visible:outline-accent"
      >
        <span className="font-display text-lg font-semibold text-ink">How to use</span>
        <motion.span
          aria-hidden="true"
          className="grid h-8 w-8 place-items-center rounded-full bg-canvas-soft text-ink-muted"
          animate={{ rotate: open ? 180 : 0 }}
          transition={reduce ? { duration: 0 } : SPRING}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6l4 4 4-4" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="how-to-body"
            key="body"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={reduce ? { duration: 0 } : SPRING}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <ol className="space-y-3">
                {steps.map((s, i) => (
                  <li key={s} className="flex gap-3 text-sm text-ink-secondary">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
              <p className="mt-4 rounded-xl bg-canvas-soft px-4 py-3 text-sm text-ink-muted">
                Your data auto-saves on this device. Nothing is uploaded to any server.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FirstRun({ onSample }) {
  const steps = [
    "Fill the form with your details, education and work.",
    "Pick a template.",
    "Pick an accent colour.",
    "Click Download as PDF.",
  ];
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
      <h2 className="font-display text-2xl font-semibold text-ink">How to use</h2>
      <ol className="mt-4 space-y-3">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3 text-base text-ink-secondary">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={onSample}
        className="mt-6 min-h-11 rounded-full border border-hairline px-5 text-sm font-medium text-ink hover:bg-canvas-soft focus-visible:outline-2 focus-visible:outline-accent"
      >
        Try with sample data
      </button>
    </div>
  );
}

function ClearConfirm({ onCancel, onConfirm }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-end bg-black/30 p-3 sm:place-items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <motion.div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="clear-title"
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        initial={reduce ? false : { y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={reduce ? { opacity: 0 } : { y: 40, opacity: 0 }}
        transition={SPRING}
      >
        <h2 id="clear-title" className="font-display text-xl font-semibold text-ink">
          Clear everything?
        </h2>
        <p className="mt-2 text-sm text-ink-muted">This removes all your details from this device. It cannot be undone.</p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="min-h-11 rounded-full px-5 text-sm font-medium text-ink hover:bg-canvas-soft focus-visible:outline-2 focus-visible:outline-accent">
            Keep my CV
          </button>
          <button type="button" onClick={onConfirm} className="min-h-11 rounded-full bg-red-700 px-5 text-sm font-semibold text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-red-700">
            Clear all
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TemplateThumb({ id, accent }) {
  const bar = { background: accent };
  const line = "h-1 rounded bg-neutral-300";
  if (id === "modern")
    return (
      <div className="flex h-full gap-1">
        <div className="w-1/3 rounded-sm" style={bar} />
        <div className="flex-1 space-y-1 pt-1">
          <div className={line} /><div className={line} /><div className={line} />
        </div>
      </div>
    );
  if (id === "compact")
    return (
      <div className="grid h-full grid-cols-2 gap-1">
        <div className="space-y-1 pt-1"><div className={line} /><div className={line} /><div className={line} /></div>
        <div className="space-y-1 pt-1"><div className={line} /><div className={line} /><div className={line} /></div>
      </div>
    );
  if (id === "minimal")
    return (
      <div className="space-y-1.5 pt-2">
        <div className="h-1.5 w-2/3 rounded bg-neutral-700" />
        <div className="mt-3 h-1 w-1/3 rounded" style={bar} />
        <div className={line} /><div className={line} />
      </div>
    );
  return (
    <div className="space-y-1 pt-1">
      <div className="mx-auto h-1.5 w-1/2 rounded" style={bar} />
      <div className="mx-auto h-1 w-1/3 rounded bg-neutral-300" />
      <div className={`${line} mt-2`} /><div className={line} /><div className={line} />
    </div>
  );
}

export default function App() {
  const [data, setData, savedAt] = useData();
  const [tab, setTab] = useState("edit");
  const [confirmClear, setConfirmClear] = useState(false);
  const [notice, setNotice] = useState("");
  const previewRef = useRef(null);
  const scale = usePreviewScale(previewRef);
  const model = previewModel(data);
  const blank = isBlank(data);

  const flash = (msg) => {
    setNotice(msg);
    window.clearTimeout(flash.t);
    flash.t = window.setTimeout(() => setNotice(""), 2600);
  };

  const loadSample = () => {
    setData(sampleCv());
    flash("Sample loaded. Replace it with your own details.");
  };

  const clearAll = () => {
    clearStoredCv();
    setData(emptyCv());
    setConfirmClear(false);
    flash("All details cleared.");
  };

  const printCv = () => {
    if (blank) {
      flash("Add your details first, then download.");
      return;
    }
    window.print();
  };

  const reduce = useReducedMotion();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-hairline bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="font-display text-xl font-semibold text-ink">Naija CV Builder</p>
            <p className="hidden text-xs text-ink-muted sm:block">A CV for Nigerian employers, built in your browser</p>
          </div>
          <div className="flex items-center gap-2">
            <SavedIndicator savedAt={savedAt} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-32 pt-5 lg:pb-12">
        <div className="mb-5 space-y-4">
          <HowToUse />
          <Tip />
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={loadSample} className="min-h-11 rounded-full border border-hairline bg-white px-4 text-sm font-medium text-ink hover:bg-canvas-soft focus-visible:outline-2 focus-visible:outline-accent">
              Load sample data
            </button>
            <button type="button" onClick={() => setConfirmClear(true)} className="min-h-11 rounded-full px-4 text-sm font-medium text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-accent">
              Clear all
            </button>
          </div>
          <AnimatePresence>
            {notice && (
              <motion.p
                key={notice}
                initial={reduce ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium text-accent"
                role="status"
              >
                {notice}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <LayoutGroup>
          <div className="mb-5 flex rounded-full bg-white p-1 shadow-sm ring-1 ring-black/5 lg:hidden" role="tablist" aria-label="Switch between editing and preview">
            {["edit", "preview"].map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`relative min-h-11 flex-1 rounded-full text-sm font-semibold capitalize transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                  tab === t ? "text-white" : "text-ink-muted"
                }`}
              >
                {tab === t && (
                  <motion.span layoutId="mobile-tab" className="absolute inset-0 rounded-full bg-accent" transition={SPRING} />
                )}
                <span className="relative">{t === "edit" ? "Edit" : "Preview"}</span>
              </button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <section className={`${tab === "edit" ? "block" : "hidden"} lg:block`} aria-label="CV details">
              {blank && (
                <div className="mb-5">
                  <FirstRun onSample={loadSample} />
                </div>
              )}
              <CvForm data={data} setData={setData} />
            </section>

            <aside className={`${tab === "preview" ? "block" : "hidden"} lg:sticky lg:top-24 lg:block lg:self-start`} aria-label="CV preview">
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
                <div className="mb-4 space-y-4">
                  <div>
                    <p className="mb-2 text-sm font-medium text-ink">Template</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4" role="radiogroup" aria-label="Template">
                      {TEMPLATES.map((t) => {
                        const on = data.template === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => setData((d) => ({ ...d, template: t.id }))}
                            className={`relative rounded-xl p-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                              on ? "ring-2 ring-accent" : "ring-1 ring-hairline hover:ring-ink-faint"
                            }`}
                          >
                            <div className="aspect-[1/1.2] overflow-hidden rounded-md bg-white p-2 ring-1 ring-black/5">
                              <TemplateThumb id={t.id} accent={data.accent} />
                            </div>
                            <span className="mt-2 block text-sm font-semibold text-ink">{t.name}</span>
                            <span className="block text-xs leading-snug text-ink-muted">{t.note}</span>
                            {on && (
                              <motion.span layoutId="template-check" className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-accent text-xs text-white" transition={SPRING}>
                                ✓
                              </motion.span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-ink">Accent colour</p>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Accent colour">
                      {ACCENTS.map((c) => {
                        const on = data.accent === c.hex;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            aria-label={c.name}
                            title={c.name}
                            onClick={() => setData((d) => ({ ...d, accent: c.hex }))}
                            className="relative grid h-11 w-11 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-accent"
                          >
                            <span className="h-8 w-8 rounded-full" style={{ background: c.hex }} />
                            {on && <motion.span layoutId="accent-ring" className="absolute inset-0 rounded-full ring-2 ring-ink ring-offset-2" transition={SPRING} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div ref={previewRef} className="overflow-hidden rounded-xl bg-canvas-soft p-4">
                  {blank ? (
                    <div className="grid aspect-[210/297] place-items-center rounded-md bg-white p-6 text-center">
                      <p className="max-w-xs text-sm text-ink-muted">Start typing your name and details. Your CV appears here as an A4 page.</p>
                    </div>
                  ) : (
                    <div className="cv-print-wrap" style={{ height: 297 * (96 / 25.4) * scale, width: "100%" }}>
                      <div
                        id="cv-print-area"
                        className="cv-print-area origin-top-left shadow-[0_1px_2px_rgba(0,0,0,0.08),0_12px_32px_-12px_rgba(0,0,0,0.25)]"
                        style={{ transform: `scale(${scale})`, width: 210 / 25.4 * 96 }}
                      >
                        <div className="cv-sheet">
                          <CvTemplates model={{ ...model, accent: data.accent }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={printCv}
                    className="flex min-h-12 w-full items-center justify-center rounded-full bg-accent px-6 text-base font-semibold text-white shadow-sm transition-transform active:scale-[0.98] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    Download as PDF
                  </button>
                  <p className="text-center text-xs text-ink-muted">
                    Choose <strong className="font-semibold text-ink-secondary">Save as PDF</strong> in the print window.
                  </p>
                  <button type="button" onClick={printCv} className="min-h-11 w-full rounded-full text-sm font-medium text-ink-secondary hover:bg-canvas-soft focus-visible:outline-2 focus-visible:outline-accent">
                    Print
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </LayoutGroup>
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-8 text-center text-xs text-ink-muted">
        <p className="mt-1 text-[11px] tracking-wide text-ink-muted/80">Created by Lord Orionstar · 09022203991</p>
      </footer>

      <AnimatePresence>
        {confirmClear && <ClearConfirm onCancel={() => setConfirmClear(false)} onConfirm={clearAll} />}
      </AnimatePresence>
    </div>
  );
}
