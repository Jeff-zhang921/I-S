type TopBackButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
};

function TopBackButton({ label, onClick, className }: TopBackButtonProps) {
  return (
    <button
      type="button"
      className={["secondary-button", "top-back-button", className].filter(Boolean).join(" ")}
      onClick={onClick}
    >
      <span className="top-back-button-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="m15 5-7 7 7 7" />
        </svg>
      </span>
      <span>{label}</span>
    </button>
  );
}

export type { TopBackButtonProps };
export default TopBackButton;
