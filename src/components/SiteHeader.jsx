import { BrandMark } from "./BrandMark.jsx";
import { siteHref } from "../lib/paths.js";

export function SiteHeader({ current }) {
  return (
    <header className="site-header">
      <a className="brand-lockup" href={siteHref()} aria-label="Ravenwatch home">
        <BrandMark className="brand-mark" />
        <span>Ravenwatch</span>
      </a>

      <nav className="site-nav" aria-label="Primary navigation">
        <a aria-current={current === "home" ? "page" : undefined} href={siteHref()}>
          Overview
        </a>
        <a
          aria-current={current === "report" ? "page" : undefined}
          href={siteHref("/benchmarks/")}
        >
          Evaluation report
        </a>
      </nav>
    </header>
  );
}
