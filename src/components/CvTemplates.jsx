import { contactItems, Personal, Summary, Experience, Education, Skills, Languages, Certifications, Referees } from "./CvSections.jsx";

function Classic({ m }) {
  const { accent, personal: p } = m;
  return (
    <div className="cv-classic">
      <header className="cv-head-center">
        <h1 style={{ color: accent }}>{p.fullName || "Your name"}</h1>
        {p.title && <p className="cv-title">{p.title}</p>}
        <p className="cv-contact">{contactItems(p).join("  ·  ")}</p>
        <Personal p={p} />
      </header>
      <Summary text={p.summary} accent={accent} />
      <Experience items={m.experience} nysc={m.nysc} accent={accent} />
      <Education items={m.education} accent={accent} />
      <Skills skills={m.skills} accent={accent} />
      <Languages items={m.languages} accent={accent} />
      <Certifications items={m.certifications} accent={accent} />
      <Referees items={m.referees} accent={accent} />
    </div>
  );
}

function Modern({ m }) {
  const { accent, personal: p } = m;
  return (
    <div className="cv-modern">
      <aside className="cv-side" style={{ background: accent }}>
        <h1>{p.fullName || "Your name"}</h1>
        {p.title && <p className="cv-side-title">{p.title}</p>}
        <div className="cv-side-block">
          <h3>Contact</h3>
          {contactItems(p).map((x) => (
            <p key={x}>{x}</p>
          ))}
          <Personal p={p} />
        </div>
        {m.skills.length > 0 && (
          <div className="cv-side-block">
            <h3>Skills</h3>
            {m.skills.map((s) => (
              <p key={s}>{s}</p>
            ))}
          </div>
        )}
        {m.languages.length > 0 && (
          <div className="cv-side-block">
            <h3>Languages</h3>
            {m.languages.map((l) => (
              <p key={l.id}>
                {l.language}
                {l.level ? ` · ${l.level}` : ""}
              </p>
            ))}
          </div>
        )}
        {m.referees.length > 0 && (
          <div className="cv-side-block">
            <h3>Referees</h3>
            {m.referees.map((r) => (
              <p key={r.id}>
                <strong>{r.name}</strong>
                <br />
                {[r.title, r.organisation, r.phone].filter(Boolean).join(", ")}
              </p>
            ))}
          </div>
        )}
      </aside>
      <main className="cv-main">
        <Summary text={p.summary} accent={accent} />
        <Experience items={m.experience} nysc={m.nysc} accent={accent} />
        <Education items={m.education} accent={accent} />
        <Certifications items={m.certifications} accent={accent} />
      </main>
    </div>
  );
}

function Minimal({ m }) {
  const { accent, personal: p } = m;
  return (
    <div className="cv-minimal">
      <header>
        <h1>{p.fullName || "Your name"}</h1>
        {p.title && <p className="cv-title" style={{ color: accent }}>{p.title}</p>}
        <p className="cv-contact">{contactItems(p).join("  ·  ")}</p>
        <Personal p={p} />
      </header>
      <Summary text={p.summary} accent={accent} />
      <Experience items={m.experience} nysc={m.nysc} accent={accent} />
      <Education items={m.education} accent={accent} />
      <Skills skills={m.skills} accent={accent} />
      <Languages items={m.languages} accent={accent} />
      <Certifications items={m.certifications} accent={accent} />
      <Referees items={m.referees} accent={accent} />
    </div>
  );
}

function Compact({ m }) {
  const { accent, personal: p } = m;
  return (
    <div className="cv-compact">
      <header>
        <h1 style={{ color: accent }}>{p.fullName || "Your name"}</h1>
        {p.title && <p className="cv-title">{p.title}</p>}
        <p className="cv-contact">{contactItems(p).join("  ·  ")}</p>
        <Personal p={p} />
      </header>
      <div className="cv-cols">
        <div className="cv-col">
          <Summary text={p.summary} accent={accent} />
          <Experience items={m.experience} nysc={m.nysc} accent={accent} />
          <Education items={m.education} accent={accent} />
        </div>
        <div className="cv-col">
          <Skills skills={m.skills} accent={accent} />
          <Languages items={m.languages} accent={accent} />
          <Certifications items={m.certifications} accent={accent} />
          <Referees items={m.referees} accent={accent} />
        </div>
      </div>
    </div>
  );
}

const RENDERERS = { classic: Classic, modern: Modern, minimal: Minimal, compact: Compact };

export default function CvTemplates({ model }) {
  const Renderer = RENDERERS[model.template] || Classic;
  return <Renderer m={model} />;
}
