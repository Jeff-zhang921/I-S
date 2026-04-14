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
      {label}
    </button>
  );
}

export type { TopBackButtonProps };
export default TopBackButton;
