import { useState } from "react";
import Register from "../Buttons/Register";
import Login from "../Buttons/Login";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <nav className="w-screen h-16 px-10 py-15 flex justify-between items-center bg-white font-inter shadow-sm relative">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <img
                        className="w-12"
                        src="../src/assets/icons/logo.svg"
                        alt="logo"
                    />
                    <div className="flex flex-col text-xl leading-none tracking-tight">
                        <h1 className="font-bold">HEALTH</h1>
                        <h1>CARE</h1>
                    </div>
                </div>

                {/* Links principais (desktop apenas) */}
                <div className="hidden lg:flex gap-10 text-primary">
                    <a href="/" className="text-lg">Para pacientes</a>
                    <a href="/" className="text-lg">Para médicos</a>
                    <a href="/" className="text-lg">Para empresas</a>
                </div>

                {/* Botão hamburguer (aparece só em mobile) */}
                <button
                    className="lg:hidden flex flex-col justify-between w-8 h-6"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span
                        className={`h-1 bg-primary rounded transition-transform ${isOpen ? "rotate-45 translate-y-2" : ""}`}
                    />
                    <span
                        className={`h-1 bg-primary rounded transition-opacity ${isOpen ? "opacity-0" : ""}`}
                    />
                    <span
                        className={`h-1 bg-primary rounded transition-transform ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
                    />
                </button>

                {/* Menu desktop (login/cadastro) */}
                <div className="hidden lg:flex text-primary text-md gap-5">
                    <Register>Cadastrar</Register>
                    <Login>Entrar</Login>
                </div>
            </nav>


            {/* Menu mobile */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-md absolute top-16 right-0  h-screen p-6 flex flex-col gap-6 text-primary">
                    <a href="/" className="text-lg">Para pacientes</a>
                    <a href="/" className="text-lg">Para médicos</a>
                    <a href="/" className="text-lg">Para empresas</a>
                    <Register>Cadastrar</Register>
                    <Login>Entrar</Login>
                </div>
            )}
        </>
    );
}
