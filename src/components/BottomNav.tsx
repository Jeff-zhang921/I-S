type BottomNavItem = {
  id: string;
  label: string;
  icon: "house" | "spark" | "bookmark" | "chat" | "profile";
};

type BottomNavProps = {
  items: BottomNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
};

function BottomNavIcon({ icon }: Pick<BottomNavItem, "icon">) {
  switch (icon) {
    case "house":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <path d="M4 10.5 12 4l8 6.5" />
          <path d="M6.5 9.5V20h11V9.5" />
          <path d="M10 20v-5.5h4V20" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <path d="m12 3 1.9 4.8L19 10l-5.1 2.2L12 17l-1.9-4.8L5 10l5.1-2.2L12 3Z" />
          <path d="m18.5 4 .6 1.5L20.5 6l-1.4.5-.6 1.5-.6-1.5L16.5 6l1.4-.5.6-1.5Z" />
        </svg>
      );
    case "bookmark":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <path d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-3.6L6 20V5.5a1 1 0 0 1 1-1Z" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <path d="M5.5 6.5h13a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H11l-4.5 3v-3H5.5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
        </svg>
      );
    case "profile":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <path d="M12 12a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
          <path d="M5 19.5a7 7 0 0 1 14 0" />
        </svg>
      );
  }

  return null;
}

function BottomNav({ items, activeId, onSelect }: BottomNavProps) {
  return (
    <nav
      className="bottom-nav"
      aria-label="Primary"
      style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;

        return (
          <button
            key={item.id}
            type="button"
            className={isActive ? "bottom-nav-item active" : "bottom-nav-item"}
            onClick={() => onSelect(item.id)}
            aria-current={isActive ? "page" : undefined}
          >
            <span className="bottom-nav-badge" aria-hidden="true">
              <BottomNavIcon icon={item.icon} />
            </span>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
