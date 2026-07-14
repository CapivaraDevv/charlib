import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.js?url";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import BookmarkRibbon from "./BookMarkRibbon";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface PdfViewerProps {
  file: string;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  bookmarked: boolean;
}

export default function PdfViewer({
  file,
  page,
  setPage,
  bookmarked,
}: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0);

  function onLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function nextPage() {
    setPage((p) => Math.min(p + 1, numPages));
  }

  function prevPage() {
    setPage((p) => Math.max(p - 1, 1));
  }

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
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
  }, [numPages]);

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
        <button onClick={prevPage} disabled={page <= 1}>
          <ChevronLeft />
        </button>

        <span>
          {page} / {numPages}
        </span>

        <button onClick={nextPage} disabled={page >= numPages}>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
