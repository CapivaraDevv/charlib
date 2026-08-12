import Logo from "../../assets/Logo.png";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menu = [
    { label: "Home", path: "/" },
    { label: "Biblioteca", path: "/library" },
    { label: "Adicionar Livro", path: "/adicionar-livro" },
    { label: "Objetivos", path: "/objetivos" },
    { label: "Estatísticas", path: "/estatisticas" },
    { label: "Configurações", path: "/configuracoes" },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col bg-[#372318]">
      <header className="flex items-center justify-center py-8">
        <img src={Logo} alt="LogoCharlib" className="w-40" />
      </header>
      <nav className="mt-8 flex flex-col gap-4 px-6">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `rounded-lg px-4 py-3 transition-colors ${
                isActive
                  ? "bg-surface-hover text-text"
                  : "text-text-muted hover:bg-surface hover:text-text"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
