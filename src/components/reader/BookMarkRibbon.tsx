interface BookmarkRibbonProps {
  active: boolean;
}

export default function BookmarkRibbon({ active }: BookmarkRibbonProps) {
  return (
    <div
      className={`
        absolute
        top-0
        right-4
        z-20
        transition-all
        duration-300
        ${
          active
            ? "translate-y-0 opacity-100"
            : "-translate-y-6 opacity-0 pointer-events-none"
        }
      `}
    >
      <svg
        width="32"
        height="84"
        viewBox="0 0 32 84"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        <path
          d="M0 0 H32 V68 L16 84 L0 68 Z"
          fill="#7A4A2A"
          stroke="#5E3420"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
