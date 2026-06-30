import logo from "../../../assets/Logo.png"

export default function Header() {
    return (
        <header className="flex flex-col items-center pt-10">
            <img src={logo} alt="Charlib" className="w-xl" />
            <h1 className="text-4xl font-bold text-center">
                Boa noite Pedro,
                <br />
                continue sua leitura
            </h1>

            <div className="w-full max-w-6xl h-px bg-[#3E281D] mt-8" />
        </header>
    )
}
