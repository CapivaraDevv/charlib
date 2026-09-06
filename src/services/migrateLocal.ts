import { getStoredBooks } from "./libraryService";
import { currentUser, getCloudRows, saveCloudBook } from "./cloudLibrary";
import { accountStorage, readAccountCache, storageAccount } from "./accountStorage";
import { flushState, getSyncStatus } from "./stateSync";

function localJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { throw new Error("Há dados locais inválidos. A migração foi interrompida sem apagá-los."); }
}
function mergeItems(key: string) {
  const legacy = localJson<{ id: string }[]>(key, []);
  const current = JSON.parse(accountStorage.getItem(key) ?? "[]") as { id: string }[];
  if (!Array.isArray(legacy) || !Array.isArray(current)) throw new Error("Formato inesperado nos dados de leitura.");
  const merged = [...new Map([...legacy, ...current].map(item => [item.id, item])).values()];
  if (merged.length) accountStorage.setItem(key, JSON.stringify(merged));
}
export async function migrateLocalLibrary(onProgress: (message: string) => void) {
  const user = currentUser();
  let source = localStorage.getItem("charlib:legacy-source");
  if (!source) { source = crypto.randomUUID(); localStorage.setItem("charlib:legacy-source", source); }
  const marker = `charlib:migrated:${user}:${source}`;
  if (localStorage.getItem(marker)) throw new Error("A biblioteca local deste navegador já foi importada para esta conta.");
  const local = await getStoredBooks();
  const remote = await getCloudRows();
  for (const [index, book] of local.entries()) {
    if (storageAccount() !== user) throw new Error("A conta mudou. A migração foi interrompida.");
    onProgress(`Importando livro ${index + 1} de ${local.length}: ${book.title}`);
    const existing = remote.find(row => row.id === book.id);
    if (existing && existing.legacy_source !== source) throw new Error("Um livro da conta usa o mesmo identificador local. A migração foi interrompida para preservar ambos.");
    if (!existing) await saveCloudBook({ title: book.title, author: book.author, pages: book.pages, status: book.status,
      file: new File([book.file], "livro.pdf", { type: "application/pdf" }),
      cover: book.cover ? new File([book.cover], "capa", { type: book.cover.type }) : null,
    }, book, source);
    if (storageAccount() !== user) throw new Error("A conta mudou.");
    mergeItems(`book-notes-${book.id}`);
    const key = `book-progress-${book.id}`;
    const saved = localStorage.getItem(key);
    const oldPage = saved === null ? book.currentPage : Number(saved);
    if (accountStorage.getItem(key) === null && Number.isFinite(oldPage)) accountStorage.setItem(key, String(Math.min(book.pages, Math.max(0, oldPage))));
  }
  mergeItems("charlib-bookmarks");
  mergeItems("reading_entries");
  for (const key of ["daily_reading_goal", "weekly_reading_goal", "monthly_reading_goal", "last-book"]) {
    const legacy = localStorage.getItem(key);
    if (legacy !== null && accountStorage.getItem(key) === null) accountStorage.setItem(key, legacy);
  }
  onProgress("Confirmando os dados enviados...");
  await flushState();
  if (storageAccount() !== user) throw new Error("A conta mudou.");
  if (getSyncStatus().conflict || Object.values(readAccountCache(user)).some(entry => entry.pending)) {
    throw new Error("Os livros foram copiados, mas há dados de leitura aguardando sincronização. Resolva o aviso e tente importar novamente.");
  }
  const verified = await getCloudRows();
  if (!local.every(book => verified.some(row => row.id === book.id && row.legacy_source === source))) throw new Error("Não foi possível confirmar todos os livros. Tente novamente.");
  localStorage.setItem(marker, new Date().toISOString());
  onProgress(`${local.length} livro(s) importado(s). Os originais locais foram mantidos.`);
}
