import type { Book } from "../types/book";
import type { NewBookInput, UpdateBookInput, StoredBook } from "./libraryService";
import { requireSupabase } from "./supabase";
import { storageAccount } from "./accountStorage";
import Logo from "../assets/Logo.png";
import { getCurrentPage } from "../utils/bookProgress";

type CloudBook = {
  user_id: string; id: number; title: string; author: string; pages: number;
  current_page: number; status: Book["status"]; rating: number;
  file_path: string; cover_path: string | null; created_at: string;
  updated_at: string; legacy_source: string | null;
};
export function currentUser() {
  const id = storageAccount();
  if (!id) throw new Error("Entre na sua conta para continuar.");
  return id;
}
function sameAccount(id: string) {
  if (storageAccount() !== id) throw new Error("A conta mudou. Tente novamente.");
}
export function newBookId() { return Date.now() * 1000 + crypto.getRandomValues(new Uint16Array(1))[0] % 1000; }
async function uploadFile(user: string, id: number, file: Blob, kind: "pdf" | "cover") {
  sameAccount(user);
  const path = `${user}/${id}/${kind}-${crypto.randomUUID()}`;
  const { error } = await requireSupabase().storage.from("charlib").upload(path, file, {
    contentType: kind === "pdf" ? "application/pdf" : file.type,
    upsert: false,
  });
  if (error) throw new Error("Não foi possível enviar o arquivo. Verifique a conexão e o armazenamento do projeto.");
  return path;
}
async function removeFiles(user: string, paths: string[]) {
  if (!paths.length || storageAccount() !== user) return;
  const { error } = await requireSupabase().storage.from("charlib").remove(paths);
  // Unreferenced immutable files can be retried without touching current files.
  if (error) console.warn("Há arquivos antigos aguardando limpeza no armazenamento.");
}
export async function getCloudRows(): Promise<CloudBook[]> {
  const user = currentUser();
  const rows: CloudBook[] = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await requireSupabase().from("books").select("*").eq("user_id", user).order("id").range(offset, offset + 499);
    if (error) throw new Error("Não foi possível carregar a biblioteca na nuvem.");
    rows.push(...data as CloudBook[]);
    if (data.length < 500) break;
  }
  sameAccount(user);
  return rows;
}
export async function getCloudBooks(): Promise<Book[]> {
  const rows = await getCloudRows();
  return Promise.all(rows.map(async row => {
    let image = Logo;
    if (row.cover_path) {
      const { data, error } = await requireSupabase().storage.from("charlib").createSignedUrl(row.cover_path, 3600);
      if (error) throw new Error("Não foi possível carregar as capas da biblioteca.");
      image = data.signedUrl;
    }
    return { id: row.id, title: row.title, author: row.author, pages: row.pages,
      currentPage: row.current_page, status: row.status, rating: row.rating,
      notes: 0, file: row.file_path, image, isUserAdded: true, cloud: true, createdAt: row.created_at, updatedAt: row.updated_at };
  }));
}
export async function saveCloudBook(input: NewBookInput, legacy?: StoredBook, source?: string): Promise<StoredBook> {
  const user = currentUser();
  const id = legacy?.id ?? newBookId();
  const uploaded: string[] = [];
  let commitAttempted = false;
  try {
    const filePath = await uploadFile(user, id, input.file, "pdf");
    uploaded.push(filePath);
    const coverPath = input.cover ? await uploadFile(user, id, input.cover, "cover") : null;
    if (coverPath) uploaded.push(coverPath);
    sameAccount(user);
    const createdAt = legacy?.createdAt ?? new Date().toISOString();
    const currentPage = input.status === "completed" ? input.pages : legacy?.currentPage ?? 0;
    commitAttempted = true;
    const { error } = await requireSupabase().from("books").insert({ user_id: user, id,
      title: input.title.trim(), author: input.author.trim(), pages: input.pages,
      current_page: currentPage, status: input.status, rating: legacy?.rating ?? 0,
      file_path: filePath, cover_path: coverPath, created_at: createdAt, legacy_source: source ?? null,
    });
    if (error) throw new Error("Não foi possível salvar o livro na nuvem. Nenhum arquivo local foi apagado.");
    return { ...legacy, id, title: input.title.trim(), author: input.author.trim(),
      pages: input.pages, currentPage, status: input.status, rating: legacy?.rating ?? 0,
      notes: legacy?.notes ?? 0, file: input.file, cover: input.cover, createdAt };
  } catch (error) {
    // A network timeout can occur after the row commits. Never delete files
    // that might already be referenced by a successful database write.
    if (!commitAttempted) await removeFiles(user, uploaded);
    throw error;
  }
}
export async function updateCloudBook(id: number, input: UpdateBookInput) {
  const user = currentUser();
  const client = requireSupabase();
  const { data: row, error: readError } = await client.from("books").select("*").eq("user_id", user).eq("id", id).single();
  if (readError) throw new Error("Livro não encontrado para edição.");
  const existing = row as CloudBook;
  if (input.expectedUpdatedAt && input.expectedUpdatedAt !== existing.updated_at) throw new Error("O livro foi alterado em outro dispositivo. Reabra a edição antes de salvar.");
  const uploaded: string[] = [];
  let commitAttempted = false;
  try {
    const filePath = input.file ? await uploadFile(user, id, input.file, "pdf") : existing.file_path;
    if (input.file) uploaded.push(filePath);
    const coverPath = input.cover === undefined ? existing.cover_path : input.cover === null ? null : await uploadFile(user, id, input.cover, "cover");
    if (input.cover && coverPath) uploaded.push(coverPath);
    sameAccount(user);
    commitAttempted = true;
    const { data, error } = await client.from("books").update({ title: input.title.trim(),
      author: input.author.trim(), pages: input.pages, status: input.status,
      current_page: input.status === "completed" ? input.pages : Math.min(input.pages, getCurrentPage({ id, status: existing.status, pages: existing.pages, currentPage: existing.current_page })),
      file_path: filePath, cover_path: coverPath,
    }).eq("user_id", user).eq("id", id).eq("updated_at", existing.updated_at).select("id");
    if (error || !data.length) throw new Error("O livro mudou em outro dispositivo ou não pôde ser salvo. Reabra a edição e tente novamente.");
    await removeFiles(user, [input.file ? existing.file_path : null, input.cover !== undefined ? existing.cover_path : null].filter((p): p is string => !!p));
  } catch (error) { if (!commitAttempted) await removeFiles(user, uploaded); throw error; }
}
export async function deleteCloudBook(id: number) {
  const user = currentUser();
  const { data, error } = await requireSupabase().from("books").delete().eq("user_id", user).eq("id", id).select("file_path,cover_path");
  if (error) throw new Error("Não foi possível excluir o livro na nuvem.");
  await removeFiles(user, data.flatMap(row => [row.file_path, row.cover_path].filter((p): p is string => !!p)));
}
