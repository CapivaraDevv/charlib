import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { ChevronLeft, Trash2 } from "lucide-react";

type ReaderHeaderProps = {
  canDelete?: boolean;
  onDelete?: () => void;
};

export default function ReaderHeader({
  canDelete = false,
  onDelete,
}: ReaderHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between gap-3 px-4 py-4 sm:px-10 sm:py-5">
      <Button
        onClick={() => navigate("/library")}
        variant="outline"
        className="flex items-center gap-2"
      >
        <ChevronLeft size={18} />
        Biblioteca
      </Button>

      {canDelete && (
        <Button
          type="button"
          variant="danger"
          className="flex items-center gap-2"
          onClick={onDelete}
        >
          <Trash2 size={18} />
          Excluir livro
        </Button>
      )}
    </header>
  );
}
