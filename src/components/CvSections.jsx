import { formatDob } from "../lib/cvData.js";

export function Heading({ children, accent }) {
  return (
    <h2 className="cv-heading" style={{ color: accent }}>
      {children}
    </h2>
  );
}

export function contactItems(p) {
  return [p.email, p.phone, p.location, p.link].filter(Boolean);
}

export function Personal({ p }) {
  const extra = [
    p.showDob && p.dob ? `Born ${formatDob(p.dob)}` : null,
    p.stateOrigin ? `State of origin: ${p.stateOrigin}` : null,
    p.nationality ? `Nationality: ${p.nationality}` : null,
  ].filter(Boolean);
  if (!extra.length) return null;
  return <p className="cv-meta">{extra.join("  ·  ")}</p>;
}

export function Summary({ text, accent }) {
  if (!text) return null;
  return (
    <section className="cv-section">
      <Heading accent={accent}>Profile</Heading>
      <p className="cv-body">{text}</p>
    </section>
  );
}

export function Experience({ items, nysc, accent }) {
  if (!items.length && !nysc) return null;
  return (
    <section className="cv-section">
      <Heading accent={accent}>Work experience</Heading>
      {items.map((e) => (
        <div key={e.id} className="cv-entry">
          <div className="cv-row">
            <strong>{e.role || e.company}</strong>
            <span className="cv-date">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
          </div>
          <div className="cv-sub">{[e.company, e.location].filter(Boolean).join(" · ")}</div>
          {e.items.length > 0 && (
            <ul className="cv-bullets" style={{ "--bullet": accent }}>
              {e.items.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
      {nysc && (
        <div className="cv-entry">
          <div className="cv-row">
            <strong>NYSC service</strong>
            <span className="cv-date">{nysc.year}</span>
          </div>
          <div className="cv-sub">{[nysc.state, nysc.batch].filter(Boolean).join(" · ")}</div>
        </div>
      )}
    </section>
  );
}

export function Education({ items, accent }) {
  if (!items.length) return null;
  return (
    <section className="cv-section">
      <Heading accent={accent}>Education</Heading>
      {items.map((e) => (
        <div key={e.id} className="cv-entry">
          <div className="cv-row">
            <strong>{e.qualification || e.institution}</strong>
            <span className="cv-date">{[e.start, e.end].filter(Boolean).join(" – ")}</span>
          </div>
          <div className="cv-sub">
            {[e.institution, e.course].filter(Boolean).join(" · ")}
          </div>
          {e.grade && <div className="cv-sub">{e.grade}</div>}
        </div>
      ))}
    </section>
  );
}

export function Skills({ skills, accent }) {
  if (!skills.length) return null;
  return (
    <section className="cv-section">
      <Heading accent={accent}>Skills</Heading>
      <p className="cv-chips">
        {skills.map((s) => (
          <span key={s} className="cv-chip" style={{ borderColor: accent }}>
            {s}
          </span>
        ))}
      </p>
    </section>
  );
}

export function Languages({ items, accent }) {
  if (!items.length) return null;
  return (
    <section className="cv-section">
      <Heading accent={accent}>Languages</Heading>
      <ul className="cv-plain">
        {items.map((l) => (
          <li key={l.id}>
            {l.language}
            {l.level ? `: ${l.level}` : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Certifications({ items, accent }) {
  if (!items.length) return null;
  return (
    <section className="cv-section">
      <Heading accent={accent}>Certifications and awards</Heading>
      <ul className="cv-bullets" style={{ "--bullet": accent }}>
        {items.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </section>
  );
}

export function Referees({ items, accent }) {
  if (!items.length) return null;
  return (
    <section className="cv-section">
      <Heading accent={accent}>Referees</Heading>
      <div className="cv-referees">
        {items.map((r) => (
          <div key={r.id} className="cv-entry">
            <strong>{r.name}</strong>
            <div className="cv-sub">{[r.title, r.organisation].filter(Boolean).join(", ")}</div>
            <div className="cv-sub">{[r.phone, r.email].filter(Boolean).join("  ·  ")}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
