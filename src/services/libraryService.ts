import type { Book } from "../types/book";
import { getCurrentPage } from "../utils/bookProgress";
import { storageAccount } from "./accountStorage";
import { saveCloudBook, updateCloudBook, deleteCloudBook } from "./cloudLibrary";

const DATABASE_NAME = "charlib";
const DATABASE_VERSION = 1;
const BOOKS_STORE = "books";

export type NewBookInput = {
    title: string;
    author: string;
    pages: number;
    status: Book["status"];
    file: File;
    cover: File | null;
};

export type StoredBook = Omit<Book, "file" | "image"> & {
    file: Blob;
    cover: Blob | null;
    createdAt: string;
};

function requestToPromise<T>(request: IDBRequest<T>) : Promise<T> {
    return new Promise ((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () =>
            reject(request.error ?? new Error("Falha na operação do Indexed DB."));
    });
}

function transactionToPromise(
  transaction: IDBTransaction,
): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();

    transaction.onerror = () =>
      reject(
        transaction.error ??
          new Error("Falha na transação do IndexedDB."),
      );

    transaction.onabort = () =>
      reject(
        transaction.error ??
          new Error("A transação do IndexedDB foi cancelada."),
      );
  });
}


function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(
      DATABASE_NAME,
      DATABASE_VERSION,
    );

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(BOOKS_STORE)) {
        database.createObjectStore(BOOKS_STORE, {
          keyPath: "id",
        });
      }
    };

    request.onsuccess = () => resolve(request.result);

    request.onerror = () =>
      reject(
        request.error ??
          new Error("Não foi possível abrir o banco de dados."),
      );
  });
}

export async function saveBook(
  input: NewBookInput,
): Promise<StoredBook> {
  if (storageAccount()) return saveCloudBook(input);
  const database = await openDatabase();

  const book: StoredBook = {
    id: Date.now(),
    title: input.title.trim(),
    author: input.author.trim(),
    pages: input.pages,
    currentPage: input.status === "completed" ? input.pages : 0,
    rating: 0,
    notes: 0,
    status: input.status,
    file: input.file,
    cover: input.cover,
    createdAt: new Date().toISOString(),
  };

  try {
    const transaction = database.transaction(
      BOOKS_STORE,
      "readwrite",
    );

    transaction.objectStore(BOOKS_STORE).add(book);

    await transactionToPromise(transaction);

    return book;
  } finally {
    database.close();
  }
}

export async function getStoredBooks(): Promise<StoredBook[]> {
  const database = await openDatabase();

  try {
    const transaction = database.transaction(
      BOOKS_STORE,
      "readonly",
    );

    const request = transaction
      .objectStore(BOOKS_STORE)
      .getAll();

    return await requestToPromise<StoredBook[]>(request);
  } finally {
    database.close();
  }
}

export async function deleteStoredBook(id: number): Promise<void> {
  if (storageAccount()) return deleteCloudBook(id);
  const database = await openDatabase();

  try {
    const transaction = database.transaction(
      BOOKS_STORE,
      "readwrite",
    );

    transaction.objectStore(BOOKS_STORE).delete(id);

    await transactionToPromise(transaction);
  } finally {
    database.close();
  }
}

export type UpdateBookInput = Omit<NewBookInput, "file" | "cover"> & {
  rating?: number;
  expectedUpdatedAt?: string;
  file?: File;
  cover?: File | null;
};

export async function updateBook(id: number, input: UpdateBookInput): Promise<void> {
  if (input.rating !== undefined && (!Number.isFinite(input.rating) || input.rating < 0 || input.rating > 5)) {
    throw new Error("A avaliação deve estar entre 0 e 5 estrelas.");
  }
  if (!input.title.trim() || !input.author.trim() || !Number.isInteger(input.pages) || input.pages < 1) {
    throw new Error("Informe título, autor e uma quantidade válida de páginas.");
  }
  if (storageAccount()) return updateCloudBook(id, input);
  const database = await openDatabase();
  try {
    const transaction = database.transaction(BOOKS_STORE, "readwrite");
    const completion = transactionToPromise(transaction);
    const store = transaction.objectStore(BOOKS_STORE);
    const request = store.get(id);
    request.onsuccess = () => {
      const existing = request.result as StoredBook | undefined;
      if (!existing) { transaction.abort(); return; }
      store.put({
        ...existing,
        rating: input.rating ?? existing.rating,
        title: input.title.trim(),
        author: input.author.trim(),
        pages: input.pages,
        status: input.status,
        currentPage: input.status === "completed" ? input.pages : Math.min(input.pages, getCurrentPage(existing)),
        file: input.file ?? existing.file,
        cover: input.cover === undefined ? existing.cover : input.cover,
      } satisfies StoredBook);
    };
    await completion;
  } finally {
    database.close();
  }
}

