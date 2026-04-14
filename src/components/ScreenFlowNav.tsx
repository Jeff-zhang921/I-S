type ScreenFlowAction = {
  label: string;
  onClick: () => void;
  tone?: "primary" | "secondary";
  disabled?: boolean;
};

type ScreenFlowNavProps = {
  eyebrow: string;
  title: string;
  description: string;
  backLabel?: string;
  onBack?: () => void;
  actions?: ScreenFlowAction[];
  showBackButton?: boolean;
};

function ScreenFlowNav({
  eyebrow,
  title,
  description,
  backLabel,
  onBack,
  actions = [],
  showBackButton = true
}: ScreenFlowNavProps) {
  const shouldShowBackButton = showBackButton && Boolean(backLabel) && Boolean(onBack);
  const hasActions = shouldShowBackButton || actions.length > 0;

  return (
    <nav className="screen-flow-nav" aria-label={`${title} navigation`}>
      <div className="screen-flow-copy">
        <p className="screen-flow-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      {hasActions ? (
        <div className="screen-flow-actions">
          {shouldShowBackButton ? (
            <button type="button" className="secondary-button" onClick={onBack}>
              {backLabel}
            </button>
          ) : null}

          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={action.tone === "primary" ? "primary-button" : "secondary-button"}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </nav>
  );
}

export type { ScreenFlowAction, ScreenFlowNavProps };
export default ScreenFlowNav;
