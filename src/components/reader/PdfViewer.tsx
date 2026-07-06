import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface PdfViewerProps { file: string; }


export default function PdfViewer({ file }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  function onLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function nextPage() {
    setPage((p) => Math.min(p + 1, numPages));
  }

  function prevPage() {
    setPage((p) => Math.max(p - 1, 1));
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Document file={file} onLoadSuccess={onLoadSuccess}>
        <Page pageNumber={page} />
      </Document>

      <div className="flex items-center gap-4">
        <button onClick={prevPage} disabled={page <= 1}>
          <ChevronLeft />
        </button>

        <span>
          Página {page} de {numPages}
        </span>

        <button onClick={nextPage} disabled={page >= numPages}>
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
