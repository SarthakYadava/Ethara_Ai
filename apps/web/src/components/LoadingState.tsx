export function LoadingState({ label = "Loading workspace" }: { label?: string }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <strong>{label}</strong>
    </div>
  );
}
