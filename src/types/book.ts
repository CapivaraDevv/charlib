export interface Book {
  id: number;
  title: string;
  author: string;
  pages: number;
  currentPage: number;
  rating: number;
  notes: number;
  image: string;

  status: "reading" | "completed" | "planned";
  file: string | null;
  isUserAdded?: boolean;
  createdAt?: string;
}
