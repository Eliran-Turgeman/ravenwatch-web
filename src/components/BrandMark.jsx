import { useId } from "react";

export function BrandMark({ className, title, ...props }) {
  const titleId = useId();
  const hasTitle = typeof title === "string" && title.length > 0;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width="1em"
      height="1em"
      className={className}
      role={hasTitle ? "img" : undefined}
      aria-hidden={hasTitle ? undefined : "true"}
      aria-labelledby={hasTitle ? titleId : undefined}
      focusable="false"
      {...props}
    >
      {hasTitle ? <title id={titleId}>{title}</title> : null}
      <circle
        cx="32"
        cy="32"
        r="25"
        fill="none"
        stroke="var(--color-carbon, #161514)"
        strokeWidth="2.5"
      />
      <circle
        cx="32"
        cy="32"
        r="14"
        fill="none"
        stroke="var(--color-ink-muted, #60594f)"
        strokeOpacity="0.45"
        strokeWidth="2.25"
      />
      <path
        d="M32 32V21.5"
        fill="none"
        stroke="var(--color-carbon, #161514)"
        strokeLinecap="round"
        strokeWidth="2.8"
      />
      <circle cx="32" cy="32" r="2.5" fill="var(--color-ink-muted, #60594f)" />
      <path
        d="M40.5 22.5c3.4 1.2 6.1 3.9 7.3 7.3"
        fill="none"
        stroke="var(--color-signal, #8f1d1d)"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
      <path
        d="M44.5 18.5c5.6 1.9 10 6.3 11.9 11.9"
        fill="none"
        stroke="var(--color-signal, #8f1d1d)"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
      <circle cx="47.5" cy="17.5" r="2.4" fill="var(--color-signal, #8f1d1d)" />
    </svg>
  );
}

export default BrandMark;
