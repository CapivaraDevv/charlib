import type { Book } from "../types/book";

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
  const database = await openDatabase();

  const book: StoredBook = {
    id: Date.now(),
    title: input.title.trim(),
    author: input.author.trim(),
    pages: input.pages,
    currentPage: 0,
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

