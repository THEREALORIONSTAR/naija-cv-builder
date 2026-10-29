import { useState } from "react";
import { uid } from "../lib/cvData.js";

export function Section({ title, hint, children }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)] ring-1 ring-black/5 sm:p-6">
      <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
      {hint && <p className="mt-1 text-sm text-ink-muted">{hint}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function Field({ label, optional, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-2 text-sm font-medium text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-ink-faint">Optional</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-muted">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full min-h-11 rounded-lg border border-hairline bg-white px-3 py-2.5 text-base text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15";

export function TextInput(props) {
  return <input {...props} className={inputClass} />;
}

export function TextArea(props) {
  return <textarea {...props} className={`${inputClass} min-h-24 resize-y leading-relaxed`} />;
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3">
      <span className="text-sm font-medium text-ink">{label}</span>
      <span className="relative inline-flex h-7 w-12 items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="absolute inset-0 rounded-full bg-hairline transition-colors peer-checked:bg-accent peer-focus-visible:ring-4 peer-focus-visible:ring-accent/25" />
        <span
          className={`absolute left-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-out ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </span>
    </label>
  );
}

export function TagInput({ tags, onChange, placeholder }) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const value = draft.trim().replace(/,$/, "").trim();
    if (value && !tags.includes(value)) onChange([...tags, value]);
    setDraft("");
  };

  const onKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !draft && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="rounded-lg border border-hairline bg-white p-2 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15">
      <ul className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <li
            key={t}
            className="flex items-center gap-1 rounded-full bg-canvas-soft py-1 pl-3 pr-1 text-sm text-ink"
          >
            {t}
            <button
              type="button"
              aria-label={`Remove ${t}`}
              onClick={() => onChange(tags.filter((x) => x !== t))}
              className="grid h-7 w-7 place-items-center rounded-full text-ink-muted hover:bg-black/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
            >
              ×
            </button>
          </li>
        ))}
        <li className="flex-1 min-w-32">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKey}
            onBlur={commit}
            placeholder={tags.length ? "Add another" : placeholder}
            aria-label="Add a skill"
            className="h-9 w-full bg-transparent px-1 text-base text-ink placeholder:text-ink-faint focus:outline-none"
          />
        </li>
      </ul>
      <p className="px-1 pt-1 text-xs text-ink-muted">Press Enter or comma to add.</p>
    </div>
  );
}

export function IconButton({ label, onClick, disabled, children, tone = "default" }) {
  const tones = {
    default: "text-ink-muted hover:bg-black/5 hover:text-ink",
    danger: "text-red-700 hover:bg-red-50",
  };
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-11 w-11 place-items-center rounded-lg transition-colors disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-accent ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

export function AddButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink-faint px-4 text-sm font-medium text-ink-secondary transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
    >
      <span aria-hidden="true" className="text-lg leading-none">+</span>
      {children}
    </button>
  );
}

export function EntryCard({ index, title, onUp, onDown, onRemove, isFirst, isLast, children }) {
  return (
    <div className="rounded-xl border border-hairline bg-canvas p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-ink-secondary">
          {title} {index + 1}
        </span>
        <div className="flex items-center">
          <IconButton label="Move up" onClick={onUp} disabled={isFirst}>
            <span aria-hidden="true">↑</span>
          </IconButton>
          <IconButton label="Move down" onClick={onDown} disabled={isLast}>
            <span aria-hidden="true">↓</span>
          </IconButton>
          <IconButton label={`Remove ${title.toLowerCase()} ${index + 1}`} onClick={onRemove} tone="danger">
            <span aria-hidden="true">✕</span>
          </IconButton>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function newEntry(kind) {
  const base = { id: uid() };
  if (kind === "education")
    return { ...base, institution: "", qualification: "", course: "", start: "", end: "", grade: "" };
  if (kind === "experience")
    return { ...base, company: "", role: "", location: "", start: "", end: "", bullets: "" };
  if (kind === "referee")
    return { ...base, name: "", title: "", organisation: "", phone: "", email: "" };
  if (kind === "language") return { ...base, language: "", level: "" };
  return base;
}

export function moveItem(list, index, delta) {
  const next = [...list];
  const target = index + delta;
  if (target < 0 || target >= next.length) return list;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
