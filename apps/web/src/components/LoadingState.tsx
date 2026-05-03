type LoadingStateProps = {
  label?: string;
  size?: "panel" | "page";
};

export function LoadingState({ label = "Loading workspace", size = "panel" }: LoadingStateProps) {
  return (
    <div className={`loading-state loading-state-${size}`} role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <strong>{label}</strong>
    </div>
  );
}
