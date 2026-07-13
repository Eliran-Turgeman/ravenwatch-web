import snapshot from "../data/latest-benchmark.json";
import { SiteFooter } from "../components/SiteFooter.jsx";
import { SiteHeader } from "../components/SiteHeader.jsx";
import {
  formatCurrency,
  formatDate,
  formatDuration,
  formatInteger,
  formatMetric,
  formatPercent,
} from "../lib/format.js";
import { siteHref } from "../lib/paths.js";

const benchmark = { ...snapshot, ...snapshot.aggregate };

const categoryLabels = {
  DenialOfService: "Denial of service",
  ElevationOfPrivilege: "Elevation of privilege",
  InformationDisclosure: "Information disclosure",
  Repudiation: "Repudiation",
  Spoofing: "Spoofing",
  Tampering: "Tampering",
};

function formatMeanStdev(mean, stdev, formatter) {
  return `${formatter(mean)} ± ${formatter(stdev)}`;
}

function MetricRow({ description, label, metric, qualifier }) {
  return (
    <article className="metric-row">
      <div className="metric-name">
        <h3>{label}</h3>
        <p>{description}</p>
      </div>
      <dl className="metric-values">
        <div>
          <dt>Precision</dt>
          <dd>{formatMetric(metric, "precision")}</dd>
        </div>
        <div>
          <dt>Recall</dt>
          <dd>{formatMetric(metric, "recall")}</dd>
        </div>
        <div>
          <dt>F1</dt>
          <dd>{formatMetric(metric, "f1")}</dd>
        </div>
      </dl>
      <p className="metric-qualifier">{qualifier}</p>
    </article>
  );
}

function StrideCoverage() {
  return (
    <div className="report-table-wrap">
      <table className="report-table stride-summary">
        <thead>
          <tr>
            <th scope="col">Threat category</th>
            <th scope="col">Coverage</th>
            <th scope="col">Matched labels</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(benchmark.threats.by_category).map(([category, metric]) => (
            <tr key={category}>
              <th scope="row">{categoryLabels[category] ?? category}</th>
              <td>{formatMetric(metric, "recall")}</td>
              <td>
                {formatInteger(metric.true_positives)} / {formatInteger(metric.expected_count)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Metadata() {
  return (
    <dl className="run-metadata">
      <div>
        <dt>Evaluation suite</dt>
        <dd>
          {snapshot.case_count} cases / {snapshot.analyzed_files} files /{" "}
          {formatInteger(snapshot.analyzed_loc)} LOC
        </dd>
      </div>
      <div>
        <dt>Repeated runs</dt>
        <dd>{snapshot.run_count} independent runs</dd>
      </div>
      <div>
        <dt>Mean cost / run</dt>
        <dd>
          {formatMeanStdev(
            benchmark.cost_usd,
            benchmark.efficiency.cost_usd_stdev,
            formatCurrency,
          )}
        </dd>
      </div>
      <div>
        <dt>Mean tokens / run</dt>
        <dd>{formatInteger(benchmark.total_tokens)}</dd>
      </div>
      <div>
        <dt>Mean processing latency / run</dt>
        <dd>{formatDuration(benchmark.latency_ms)}</dd>
      </div>
      <div>
        <dt>Mean wall-clock / run</dt>
        <dd>{formatDuration(benchmark.wall_clock_ms)}</dd>
      </div>
    </dl>
  );
}

export function ReportPage() {
  const belowGateRuns = snapshot.threat_coverage_runs.filter((coverage) => coverage < 0.8).length;
  const belowCategoryGate = Object.entries(benchmark.threats.by_category)
    .filter(([, metric]) => metric.recall < 0.7)
    .map(([category]) => categoryLabels[category] ?? category)
    .join(", ");
  const categoryGateSummary = belowCategoryGate
    ? `${belowCategoryGate} remain below 70%.`
    : "Every threat category cleared 70% coverage.";
  const repeatGateSummary = belowGateRuns
    ? `${belowGateRuns} of ${snapshot.run_count} runs fell below 80%.`
    : `All ${snapshot.run_count} runs cleared 80% coverage.`;

  return (
    <div className="site-shell">
      <SiteHeader current="report" />

      <main className="report">
        <header className="report-masthead">
          <div>
            <p className="eyebrow">Evaluation report / v0</p>
            <h1>How Ravenwatch performs</h1>
          </div>
          <div className="report-stamp">
            <span>Published engineering evaluation</span>
            <strong>{formatDate(snapshot.generated_at)}</strong>
            <span>
              {snapshot.run_count} runs / {snapshot.case_count} cases
            </span>
          </div>
        </header>

        <section className="report-opening" aria-labelledby="report-summary-title">
          <h2 id="report-summary-title">A public account of what works and what does not yet.</h2>
          <div>
            <p>
              I built Ravenwatch as an AI engineering system, not a one-shot model demo. This
              report measures the complete product across repeated runs and publishes the result
              even though the threat-recall target was missed.
            </p>
            <p className="report-provenance">
              Built by <strong>Eliran Turgeman</strong>
            </p>
          </div>
        </section>

        <section className="headline-score" aria-labelledby="headline-title">
          <div>
            <p className="section-index">01 / Result</p>
            <h2 id="headline-title">Data-flow recall is complete. Threat coverage needs work.</h2>
          </div>
          <div className="headline-number">
            <strong>{formatPercent(benchmark.flows.recall)}</strong>
            <span>Expected flows found</span>
          </div>
          <p>
            Across three runs, Ravenwatch found all labeled data flows with{" "}
            {formatPercent(benchmark.flows.precision)} precision. Threat coverage reached{" "}
            {formatPercent(benchmark.threats.coverage)}, below the 85% capability target.
          </p>
        </section>

        <section className="report-section" aria-labelledby="quality-title">
          <div className="report-section-heading">
            <p className="section-index">02 / Quality</p>
            <h2 id="quality-title">Headline metrics</h2>
            <p>
              Counts are pooled across {snapshot.run_count} complete runs. Threat precision and F1
              are conservative lower bounds because labels are intentionally sparse.
            </p>
          </div>
          <div className="metric-list">
            <MetricRow
              label="Data flows"
              description="Movement between system endpoints."
              metric={benchmark.flows}
              qualifier={`${benchmark.flows.true_positives} matched / ${benchmark.flows.false_negatives} missed / ${benchmark.flows.false_positives} unmatched`}
            />
            <MetricRow
              label="Privacy fields"
              description="Sensitive fields attached to observed flows."
              metric={benchmark.privacy_fields}
              qualifier={`${benchmark.privacy_fields.true_positives} matched / ${benchmark.privacy_fields.false_negatives} missed / ${benchmark.privacy_fields.false_positives} unmatched`}
            />
            <MetricRow
              label="Security threats*"
              description="Threat coverage across standard security categories."
              metric={{ ...benchmark.threats, recall: benchmark.threats.coverage }}
              qualifier={`${benchmark.threats.matched} matched / ${benchmark.threats.expected_count} minimum-set labels`}
            />
          </div>
        </section>

        <section className="report-section" aria-labelledby="engineering-title">
          <div className="report-section-heading">
            <p className="section-index">03 / Engineering</p>
            <h2 id="engineering-title">What this project demonstrates</h2>
          </div>
          <div className="method-grid">
            <article>
              <span>01</span>
              <h3>End-to-end system design</h3>
              <p>
                Multiple analysis stages work together as one repeatable product workflow rather
                than an isolated model call.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Trust by design</h3>
              <p>
                Structured outputs, evidence checks, and clear failure states make results easier
                to inspect and challenge.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Runtime operations</h3>
              <p>
                Reliability, observability, cost, and latency are measured as first-class product
                concerns.
              </p>
            </article>
            <article>
              <span>04</span>
              <h3>Evaluation discipline</h3>
              <p>
                Quality, cost, tokens, latency, and wall-clock time are recorded across repeated
                runs against a fixed labeled suite.
              </p>
            </article>
          </div>
        </section>

        <section className="secondary-metrics" aria-labelledby="summary-title">
          <div>
            <p className="section-index">04 / Evaluation</p>
            <h2 id="summary-title">Stable extraction. Uneven threat recall.</h2>
          </div>
          <dl>
            <div>
              <dt>Combined extraction F1</dt>
              <dd>
                {formatMeanStdev(
                  benchmark.efficiency.combined_f1,
                  benchmark.efficiency.combined_f1_stdev,
                  formatPercent,
                )}
              </dd>
              <dd className="metric-note">Mean ± sample deviation across complete runs</dd>
            </div>
            <div>
              <dt>Privacy classification</dt>
              <dd>{formatPercent(benchmark.privacy_classification.accuracy)}</dd>
              <dd className="metric-note">
                {benchmark.privacy_classification.correct} /{" "}
                {benchmark.privacy_classification.total} matched fields
              </dd>
            </div>
          </dl>
        </section>

        <section className="report-section" aria-labelledby="stride-title">
          <div className="report-section-heading">
            <p className="section-index">05 / Threat coverage</p>
            <h2 id="stride-title">Where threat detection is strongest and weakest</h2>
            <p>
              Coverage is recall against the labeled minimum set. Precision is omitted here because
              sparse labels make it a lower bound rather than an exhaustive product-quality score.
            </p>
          </div>
          <StrideCoverage />
        </section>

        <section className="report-section" aria-labelledby="method-title">
          <div className="report-section-heading">
            <p className="section-index">06 / Method</p>
            <h2 id="method-title">How to read this evaluation</h2>
          </div>
          <div className="method-grid">
            <article>
              <span>01</span>
              <h3>Fixed labeled suite</h3>
              <p>
                Twelve synthetic software fixtures cover {snapshot.analyzed_files} files and{" "}
                {formatInteger(snapshot.analyzed_loc)} lines of code.
              </p>
            </article>
            <article>
              <span>02</span>
              <h3>Order-independent scoring</h3>
              <p>
                Maximum-cardinality matching prevents output order from changing true-positive
                counts.
              </p>
            </article>
            <article>
              <span>03</span>
              <h3>Repeated complete runs</h3>
              <p>
                Three independent runs expose model variation while keeping the evaluation suite
                and scoring rules fixed.
              </p>
            </article>
            <article>
              <span>04</span>
              <h3>Separate quality families</h3>
              <p>
                Combined F1 covers flow and privacy extraction. Threat quality remains separate so
                a strong extraction score cannot hide weak threat recall.
              </p>
            </article>
          </div>
        </section>

        <section className="report-section limitations" aria-labelledby="limits-title">
          <div className="report-section-heading">
            <p className="section-index">07 / Known limits</p>
            <h2 id="limits-title">What Ravenwatch cannot claim yet</h2>
          </div>
          <div className="limitation-list">
            <article>
              <h3>The current threat-recall gate was missed.</h3>
              <p>
                Coverage is {formatPercent(benchmark.threats.coverage)} versus the 85% target.{" "}
                {categoryGateSummary} {repeatGateSummary}
              </p>
            </article>
            <article>
              <h3>No blind holdout result yet.</h3>
              <p>
                The locked holdout was not run, so this report makes no claim about unseen systems
                or absolute capability.
              </p>
            </article>
            <article>
              <h3>The suite is intentionally small.</h3>
              <p>
                Twelve fixtures make measurement repeatable, but they do not represent every
                architecture, dependency graph, or production environment.
              </p>
            </article>
          </div>
        </section>

        <section className="report-section run-section" aria-labelledby="metadata-title">
          <div className="report-section-heading">
            <p className="section-index">08 / Metadata</p>
            <h2 id="metadata-title">Evaluation scope and cost</h2>
          </div>
          <Metadata />
          <p className="report-footnote">
            Cost and latency describe this evaluation, not a production service-level objective.
          </p>
        </section>

        <footer className="report-close">
          <p>Ravenwatch evaluation / v0</p>
          <p>Built and published by Eliran Turgeman.</p>
          <a className="text-link" href={siteHref()}>
            Return to overview <span aria-hidden="true">&uarr;</span>
          </a>
        </footer>
      </main>

      <SiteFooter />
    </div>
  );
}
