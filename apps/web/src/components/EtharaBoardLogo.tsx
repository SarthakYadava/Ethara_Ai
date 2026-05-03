export function EtharaBoardLogo() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 40 40" role="img" focusable="false">
        <rect className="logo-board" x="7" y="8" width="26" height="24" rx="6" />
        <path className="logo-line" d="M14 15h12" />
        <path className="logo-line" d="M14 20h7" />
        <path className="logo-line" d="M14 25h4" />
        <path className="logo-check" d="m22.5 25 2.4 2.4 5-5.5" />
      </svg>
    </span>
  );
}
