import { useEffect, useState } from "react";
import { getBooksPerRow } from "../utils/bookshelf";

export function useBooksPerRow(): number {
  const [perRow, setPerRow] = useState(() =>
    typeof window !== "undefined" ? getBooksPerRow(window.innerWidth) : 10
  );

  useEffect(() => {
    function handleResize() {
      setPerRow(getBooksPerRow(window.innerWidth));
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return perRow;
}
