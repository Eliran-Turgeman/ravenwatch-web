import snapshot from "../data/latest-benchmark.json";
import { AccessForm } from "../components/AccessForm.jsx";
import { SiteFooter } from "../components/SiteFooter.jsx";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { formatDate, formatPercent } from "../lib/format.js";
import { siteHref } from "../lib/paths.js";

const benchmark = { ...snapshot, ...snapshot.aggregate };

export function HomePage() {
  return (
    <div className="site-shell">
      <SiteHeader current="home" />

      <main>
        <section className="hero">
          <p className="eyebrow">AI systems engineering / privacy and security</p>
          <h1>I built Ravenwatch to review software systems for privacy and security risk.</h1>
          <p className="hero-summary">
            Ravenwatch analyzes how data moves through a codebase, identifies privacy exposure,
            reviews security threats, and links findings back to source evidence.
          </p>
          <p className="builder-line">
            Built by <strong>Eliran Turgeman</strong>
          </p>
          <div className="hero-actions">
            <a className="text-link" href="#system">
              See how it works <span aria-hidden="true">{"\u2198"}</span>
            </a>
            <a className="quiet-link" href={siteHref("/benchmarks/")}>
              Read the evaluation report
            </a>
          </div>
        </section>

        <section className="capabilities" aria-labelledby="capabilities-title">
          <div className="section-heading">
            <p className="section-index">01 / Product</p>
            <h2 id="capabilities-title">What Ravenwatch reviews</h2>
          </div>
          <ol className="capability-list">
            <li>
              <span>01</span>
              <h3>Data movement</h3>
              <p>Maps where data enters, changes, persists, and leaves a software system.</p>
            </li>
            <li>
              <span>02</span>
              <h3>Privacy exposure</h3>
              <p>Identifies sensitive fields and the services, stores, and boundaries they cross.</p>
            </li>
            <li>
              <span>03</span>
              <h3>Security threats</h3>
              <p>Reviews likely attack paths and returns source-linked findings.</p>
            </li>
          </ol>
        </section>

        <section className="system" id="system" aria-labelledby="system-title">
          <div className="section-heading">
            <p className="section-index">02 / System</p>
            <h2 id="system-title">Built as a system, not a prompt</h2>
          </div>
          <div className="method-grid">
            <article>
              <span>01</span>
              <h3>Structured analysis</h3>
              <p>
                Builds a coherent view of the system before evaluating privacy and security risk.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Specialized review stages</h3>
              <p>
                Separates system mapping, privacy analysis, threat review, and reporting into a
                repeatable workflow.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Evidence integrity</h3>
              <p>
                Keeps findings tied to file and line references so teams can inspect the evidence.
              </p>
            </article>
            <article>
              <span>04</span>
              <h3>Production-minded engineering</h3>
              <p>
                Treats reliability, observability, cost, and repeatability as system requirements.
              </p>
            </article>
          </div>
        </section>

        <section className="proof" aria-labelledby="proof-title">
          <div>
            <p className="section-index">03 / Evaluation</p>
            <h2 id="proof-title">Measured honestly, including the misses</h2>
          </div>
          <div className="proof-score">
            <strong>{snapshot.run_count}x</strong>
            <span>Independent benchmark runs</span>
          </div>
          <div className="proof-copy">
            <p>
              {snapshot.case_count} labeled cases &middot; {snapshot.analyzed_files} files &middot;{" "}
              {formatDate(snapshot.generated_at)}
            </p>
            <p>
              Across the latest evaluation, Ravenwatch found{" "}
              {formatPercent(benchmark.flows.recall)} of expected data flows and scored{" "}
              {formatPercent(benchmark.privacy_fields.f1)} F1 on privacy fields. Threat coverage
              reached {formatPercent(benchmark.threats.coverage)}, below the 85% capability bar set
              in advance.
            </p>
            <a className="text-link" href={siteHref("/benchmarks/")}>
              Read methods and limitations <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </section>

        <section className="access" id="access" aria-labelledby="access-title">
          <p className="section-index">04 / Preview</p>
          <div>
            <h2 id="access-title">Ravenwatch is available for private evaluation.</h2>
            <p>
              I am working with a small group of engineering teams to test it against real systems.
            </p>
            <AccessForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
