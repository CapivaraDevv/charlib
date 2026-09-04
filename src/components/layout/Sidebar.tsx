import Logo from "../../assets/Logo.png";
import { NavLink } from "react-router-dom";

type SidebarProps = {
  mobile?: boolean;
};

export default function Sidebar({ mobile = false }: SidebarProps) {
  const menu = [
    { label: "Home", path: "/" },
    { label: "Biblioteca", path: "/library" },
    { label: "Adicionar Livro", path: "/adicionar-livro" },
    { label: "Objetivos", path: "/objetivos" },
  ];

  return (
    <aside
      className={
        mobile
          ? "w-full bg-[#372318]"
          : "flex h-screen w-64 flex-col bg-[#372318]"
      }
    >
      <header
        className={
          mobile
            ? "flex items-center px-4 py-3"
            : "flex items-center justify-center py-8"
        }
      >
        <img src={Logo} alt="LogoCharlib" className={mobile ? "w-24" : "w-72"} />
      </header>
      <nav
        className={
          mobile
            ? "flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none [&::-webkit-scrollbar]:hidden"
            : "mt-8 flex flex-col gap-4 px-6"
        }
      >
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${mobile ? "shrink-0 px-3 py-2 text-sm" : "px-4 py-3"} rounded-lg transition-colors ${
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
