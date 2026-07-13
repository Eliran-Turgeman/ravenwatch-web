import { BrandMark } from "./BrandMark.jsx";
import { siteHref } from "../lib/paths.js";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a className="footer-mark" href={siteHref()} aria-label="Ravenwatch home">
        <BrandMark />
      </a>
      <p>
        Built by{" "}
        <a href="https://github.com/Eliran-Turgeman" rel="noreferrer">
          Eliran Turgeman
        </a>
      </p>
      <p>Ravenwatch &middot; AI systems engineering</p>
    </footer>
  );
}
