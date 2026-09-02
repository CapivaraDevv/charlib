import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.js?url";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import BookmarkRibbon from "./BookMarkRibbon";
import Button from "../common/Button";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface PdfViewerProps {
  file: string;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  bookmarked: boolean;
  onPageRead: (page: number) => boolean;
  navigationEnabled: boolean;
}

export default function PdfViewer({
  file,
  page,
  setPage,
  bookmarked,
  onPageRead,
  navigationEnabled,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [lastPageRegistered, setLastPageRegistered] = useState(false);

  function onLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function handleRegisterLastPage() {
    if (
      !navigationEnabled ||
      numPages <= 0 ||
      page !== numPages ||
      lastPageRegistered === true
    ) {
      return;
    }
    const success = onPageRead(page);

    if (success === true) {
      setLastPageRegistered(true);
    }
  }

  const nextPage = useCallback(() => {
    if (!navigationEnabled || numPages === 0 || page < 1 || page >= numPages) {
      return;
    }

    onPageRead(page);
    setPage(page + 1);
  }, [navigationEnabled, numPages, page, onPageRead, setPage]);

  const prevPage = useCallback(() => {
    if (!navigationEnabled || page <= 1) {
      return;
    }
    setPage(page - 1);
  }, [setPage, navigationEnabled, page]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      const target = event.target;

      if (
        !navigationEnabled ||
        event.defaultPrevented ||
        event.repeat ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        (target instanceof HTMLElement &&
          (target.isContentEditable ||
            target.closest("input, textarea, select, button")))
      ) {
        return;
      }

      if (event.key === "ArrowRight") {
        nextPage();
      }

      if (event.key === "ArrowLeft") {
        prevPage();
      }
    }

    window.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [nextPage, prevPage, navigationEnabled]);

  return (
    <div className="flex flex-col items-center gap-4 mb-4">
      <div className="relative inline-block">
        <BookmarkRibbon active={bookmarked} />

        <Document file={file} onLoadSuccess={onLoadSuccess}>
          <Page
            pageNumber={page}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />

          {page < numPages && (
            <div className="hidden">
              <Page
                pageNumber={page + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          )}

          {page > 1 && (
            <div className="hidden">
              <Page
                pageNumber={page - 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          )}
        </Document>
      </div>

      <div className="flex gap-4">
        <button onClick={prevPage} disabled={!navigationEnabled || page <= 1}>
          <ChevronLeft />
        </button>

        <span>
          {page} / {numPages}
        </span>

        <button
          onClick={nextPage}
          disabled={!navigationEnabled || numPages === 0 || page >= numPages}
        >
          <ChevronRight />
        </button>
      </div>

      {numPages > 0 && page === numPages && (
        <Button type="button" onClick={handleRegisterLastPage} disabled={!navigationEnabled || lastPageRegistered}>
          {lastPageRegistered
            ? "Última página registrada"
            : "Registrar última página"}
        </Button>
      )}
    </div>
  );
}
