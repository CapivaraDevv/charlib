interface BookmarkRibbonProps {
  active: boolean;
}

import mouseBookmark from "../../assets/decorations/mouse-bookmark.png";

export default function BookmarkRibbon({ active }: BookmarkRibbonProps) {
  return (
    <div
      className={`
      pointer-events-none absolute right-2 -top-12 z-20
      transition-all duration-300 sm:right-4
      ${active ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}
    `}
    >
      <img
        src={mouseBookmark}
        alt=""
        aria-hidden="true"
        className="h-32 w-auto max-w-none drop-shadow-lg sm:h-36"
      />
    </div>
  );
}
