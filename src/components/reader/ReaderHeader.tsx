import { useNavigate } from "react-router-dom";
import Button from "../common/Button";
import { ChevronLeft } from "lucide-react";


export default function ReaderHeader() {
  const navigate = useNavigate();

  return (
    <header className="flex items-center px-10 py-5">
      <Button
        onClick={() => navigate("/library")}
        variant="outline"
        className="flex items-center gap-2"
      >
        <ChevronLeft size={18}/>
        Biblioteca
      </Button>
    </header>
  );
}
