import { ReactNode } from "react";

type HeaderItem = {
  id: string;
  label: string;
};

type AppHeaderProps = {
  items: HeaderItem[];
  activeId: string;
  title?: ReactNode;
  subtitle?: ReactNode;
};

function AppHeader({ items, activeId, title, subtitle }: AppHeaderProps) {
  const activeIndex = items.findIndex((item) => item.id === activeId);

  return (
    <header className="topbar">
      <div className="brand-lockup">
        <div className="brand-mark" aria-hidden="true" />
        <div>
          <p className="brand-title">Roommate Match</p>
          <p className="brand-subtitle">Bristol compatibility prototype</p>
        </div>
      </div>

      <div className="topbar-copy">
        {title ? <p className="topbar-title">{title}</p> : null}
        {subtitle ? <p className="topbar-subtitle">{subtitle}</p> : null}
      </div>

      <ol className="screen-pills" aria-label="Progress">
        {items.map((item, index) => {
          const state = index === activeIndex ? "active" : index < activeIndex ? "done" : "upcoming";

          return (
            <li
              key={item.id}
              className={`screen-pill ${state}`}
              aria-current={state === "active" ? "step" : undefined}
            >
              <span>{index + 1}</span>
              <strong>{item.label}</strong>
            </li>
          );
        })}
      </ol>
    </header>
  );
}

export default AppHeader;
