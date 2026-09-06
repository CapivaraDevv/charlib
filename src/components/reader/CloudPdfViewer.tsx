import { useEffect, useState, type ComponentProps } from "react";
import PdfViewer from "./PdfViewer";
import { requireSupabase } from "../../services/supabase";
import Button from "../common/Button";

export default function CloudPdfViewer(props: ComponentProps<typeof PdfViewer>) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    requireSupabase().storage.from("charlib").download(props.file).then(({ data, error }) => {
      if (cancelled) return;
      if (error || !data) { setError("Não foi possível baixar o PDF. Confira sua conexão e tente novamente."); return; }
      objectUrl = URL.createObjectURL(data); setUrl(objectUrl); setError("");
    }).catch(() => { if (!cancelled) setError("Não foi possível conectar ao armazenamento."); });
    return () => { cancelled = true; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [props.file, attempt]);
  if (!url) return <div className="p-6 text-center"><p role={error ? "alert" : "status"}>{error || "Baixando seu PDF..."}</p>{error && <Button onClick={() => setAttempt(n => n + 1)} className="mt-3">Tentar novamente</Button>}</div>;
  return <PdfViewer {...props} file={url} />;
}
