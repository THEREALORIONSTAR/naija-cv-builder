import {
  Section,
  Field,
  TextInput,
  TextArea,
  Toggle,
  TagInput,
  AddButton,
  EntryCard,
  newEntry,
  moveItem,
} from "./FormParts.jsx";

const SUMMARY_MAX = 400;

export default function CvForm({ data, setData }) {
  const set = (key, value) => setData((d) => ({ ...d, [key]: value }));
  const setP = (key, value) => setData((d) => ({ ...d, personal: { ...d.personal, [key]: value } }));
  const list = (key, updater) => setData((d) => ({ ...d, [key]: updater(d[key]) }));

  const p = data.personal;

  const listEditor = (key, kind, title, renderFields) =>
    data[key].map((item, i, arr) => (
      <EntryCard
        key={item.id}
        index={i}
        title={title}
        isFirst={i === 0}
        isLast={i === arr.length - 1}
        onUp={() => list(key, (l) => moveItem(l, i, -1))}
        onDown={() => list(key, (l) => moveItem(l, i, 1))}
        onRemove={() => list(key, (l) => l.filter((x) => x.id !== item.id))}
      >
        {renderFields(item, (patch) =>
          list(key, (l) => l.map((x) => (x.id === item.id ? { ...x, ...patch } : x))),
        )}
      </EntryCard>
    ));

  return (
    <div className="space-y-5">
      <Section title="Personal details" hint="Your name and contact details appear at the top of your CV.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <TextInput value={p.fullName} onChange={(e) => setP("fullName", e.target.value)} placeholder="e.g. Chidinma Eze" autoComplete="name" />
          </Field>
          <Field label="Professional title" hint='For example, "Junior Accountant"'>
            <TextInput value={p.title} onChange={(e) => setP("title", e.target.value)} placeholder="e.g. Junior Accountant" />
          </Field>
          <Field label="Email">
            <TextInput type="email" value={p.email} onChange={(e) => setP("email", e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </Field>
          <Field label="Phone">
            <TextInput type="tel" value={p.phone} onChange={(e) => setP("phone", e.target.value)} placeholder="+234 803 000 0000" autoComplete="tel" />
          </Field>
          <Field label="City and state">
            <TextInput value={p.location} onChange={(e) => setP("location", e.target.value)} placeholder="e.g. Yaba, Lagos" autoComplete="address-level2" />
          </Field>
          <Field label="LinkedIn or portfolio" optional>
            <TextInput value={p.link} onChange={(e) => setP("link", e.target.value)} placeholder="linkedin.com/in/yourname" />
          </Field>
          <Field label="State of origin" optional>
            <TextInput value={p.stateOrigin} onChange={(e) => setP("stateOrigin", e.target.value)} placeholder="e.g. Anambra" />
          </Field>
          <Field label="Nationality" optional>
            <TextInput value={p.nationality} onChange={(e) => setP("nationality", e.target.value)} placeholder="Nigerian" />
          </Field>
        </div>
        <div className="rounded-xl bg-canvas-soft px-4 py-2">
          <Toggle label="Show date of birth on my CV" checked={p.showDob} onChange={(v) => setP("showDob", v)} />
          {p.showDob && (
            <Field label="Date of birth">
              <TextInput type="date" value={p.dob} onChange={(e) => setP("dob", e.target.value)} />
            </Field>
          )}
          {p.showDob || <p className="pb-3 text-xs text-ink-muted">Hidden by default. Turn it on only if an employer asks for it.</p>}
        </div>
        <Field label="Profile summary" optional hint={`${p.summary.length} / ${SUMMARY_MAX} characters. Two or three sentences work best.`}>
          <TextArea
            value={p.summary}
            maxLength={SUMMARY_MAX}
            onChange={(e) => setP("summary", e.target.value)}
            placeholder="A recent accounting graduate with hands-on bookkeeping experience..."
          />
        </Field>
      </Section>

      <Section title="Education" hint="Add your most recent qualification first. WAEC, NECO and university all count.">
        {listEditor("education", "education", "Education", (e, patch) => (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Institution">
                <TextInput value={e.institution} onChange={(ev) => patch({ institution: ev.target.value })} placeholder="e.g. University of Lagos" />
              </Field>
              <Field label="Qualification">
                <TextInput value={e.qualification} onChange={(ev) => patch({ qualification: ev.target.value })} placeholder="e.g. B.Sc. Accounting, WAEC SSCE" />
              </Field>
              <Field label="Course of study" optional>
                <TextInput value={e.course} onChange={(ev) => patch({ course: ev.target.value })} placeholder="e.g. Science" />
              </Field>
              <Field label="Grade or class" optional>
                <TextInput value={e.grade} onChange={(ev) => patch({ grade: ev.target.value })} placeholder="e.g. Second Class Upper" />
              </Field>
              <Field label="Start year">
                <TextInput inputMode="numeric" value={e.start} onChange={(ev) => patch({ start: ev.target.value })} placeholder="2019" />
              </Field>
              <Field label="End year">
                <TextInput value={e.end} onChange={(ev) => patch({ end: ev.target.value })} placeholder="2023 or Present" />
              </Field>
            </div>
          </>
        ))}
        <AddButton onClick={() => list("education", (l) => [...l, newEntry("education")])}>Add education</AddButton>
      </Section>

      <Section title="Work experience and internships" hint="Start each achievement with an action verb, such as Managed, Prepared or Led.">
        {listEditor("experience", "experience", "Role", (e, patch) => (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Job title or role">
                <TextInput value={e.role} onChange={(ev) => patch({ role: ev.target.value })} placeholder="e.g. Accounts Intern" />
              </Field>
              <Field label="Company">
                <TextInput value={e.company} onChange={(ev) => patch({ company: ev.target.value })} placeholder="e.g. Bright Future Ventures" />
              </Field>
              <Field label="Location" optional>
                <TextInput value={e.location} onChange={(ev) => patch({ location: ev.target.value })} placeholder="e.g. Ikeja, Lagos" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Start">
                  <TextInput value={e.start} onChange={(ev) => patch({ start: ev.target.value })} placeholder="Jun 2023" />
                </Field>
                <Field label="End">
                  <TextInput value={e.end} onChange={(ev) => patch({ end: ev.target.value })} placeholder="Dec 2023" />
                </Field>
              </div>
            </div>
            <Field label="Achievements" hint="One per line. Each line becomes a bullet point.">
              <TextArea rows={4} value={e.bullets} onChange={(ev) => patch({ bullets: ev.target.value })} placeholder={"Prepared monthly bank reconciliations\nReduced invoice delays by 25%"} />
            </Field>
          </>
        ))}
        <AddButton onClick={() => list("experience", (l) => [...l, newEntry("experience")])}>Add work or internship</AddButton>

        <div className="rounded-xl border border-hairline p-4">
          <Toggle label="I completed NYSC service" checked={data.nysc.enabled} onChange={(v) => set("nysc", { ...data.nysc, enabled: v })} />
          {data.nysc.enabled && (
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <Field label="State posted">
                <TextInput value={data.nysc.state} onChange={(ev) => set("nysc", { ...data.nysc, state: ev.target.value })} placeholder="e.g. Rivers" />
              </Field>
              <Field label="Batch" optional>
                <TextInput value={data.nysc.batch} onChange={(ev) => set("nysc", { ...data.nysc, batch: ev.target.value })} placeholder="e.g. 2024 Batch B" />
              </Field>
              <Field label="Year">
                <TextInput value={data.nysc.year} onChange={(ev) => set("nysc", { ...data.nysc, year: ev.target.value })} placeholder="2024" />
              </Field>
            </div>
          )}
        </div>
      </Section>

      <Section title="Skills, languages and certifications">
        <Field label="Skills" hint="Add software, technical and people skills.">
          <TagInput tags={data.skills} onChange={(v) => set("skills", v)} placeholder="e.g. Excel, Payroll, Teamwork" />
        </Field>
        <div>
          <span className="mb-1.5 block text-sm font-medium text-ink">Languages</span>
          {listEditor("languages", "language", "Language", (l, patch) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Language">
                <TextInput value={l.language} onChange={(ev) => patch({ language: ev.target.value })} placeholder="e.g. Yoruba" />
              </Field>
              <Field label="Proficiency">
                <TextInput value={l.level} onChange={(ev) => patch({ level: ev.target.value })} placeholder="e.g. Fluent, Native" />
              </Field>
            </div>
          ))}
          <div className="mt-3">
            <AddButton onClick={() => list("languages", (l) => [...l, newEntry("language")])}>Add language</AddButton>
          </div>
        </div>
        <Field label="Certifications and awards" optional hint="One per line.">
          <TextArea rows={3} value={data.certifications} onChange={(e) => set("certifications", e.target.value)} placeholder={"ACCA Level 1\nBest Final Year Student, 2023"} />
        </Field>
      </Section>

      <Section title="Referees" hint="Ask people before you list them.">
        {listEditor("referees", "referee", "Referee", (r, patch) => (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <TextInput value={r.name} onChange={(ev) => patch({ name: ev.target.value })} placeholder="e.g. Mr Emeka Nwankwo" />
            </Field>
            <Field label="Title" optional>
              <TextInput value={r.title} onChange={(ev) => patch({ title: ev.target.value })} placeholder="e.g. Senior Accountant" />
            </Field>
            <Field label="Organisation" optional>
              <TextInput value={r.organisation} onChange={(ev) => patch({ organisation: ev.target.value })} />
            </Field>
            <Field label="Phone" optional>
              <TextInput type="tel" value={r.phone} onChange={(ev) => patch({ phone: ev.target.value })} />
            </Field>
            <Field label="Email" optional>
              <TextInput type="email" value={r.email} onChange={(ev) => patch({ email: ev.target.value })} />
            </Field>
          </div>
        ))}
        <AddButton onClick={() => list("referees", (l) => [...l, newEntry("referee")])}>Add referee</AddButton>
      </Section>

    </div>
  );
}
