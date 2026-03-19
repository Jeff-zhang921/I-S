type BottomNavItem = {
  id: string;
  label: string;
  badge: string;
};

type BottomNavProps = {
  items: BottomNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
};

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
              {item.badge}
            </span>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
