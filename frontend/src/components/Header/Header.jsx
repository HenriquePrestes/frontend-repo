import { FaChevronDown, FaUser, FaSignOutAlt } from 'react-icons/fa'; // Importe um ícone de sua preferência
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';
import { useTheme } from "../../context/useTheme";

export default function Header() {
    const { theme } = useTheme();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, logout } = useAuth();

    const dropdownRef = useRef(null);

    const handleToggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleCloseDropdown = () => {
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        // Função que será chamada em *qualquer* clique na página
        const handleClickOutside = (event) => {
            // Verifica se:
            // 1. O menu está aberto
            // 2. O ref existe (dropdownRef.current)
            // 3. O clique (event.target) NÃO foi dentro do ref
            if (isDropdownOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                handleCloseDropdown(); // Fecha o menu
            }
        };

        // Adiciona o "ouvinte de evento" ao documento
        document.addEventListener('mousedown', handleClickOutside);

        // Função "limpeza": é crucial remover o "ouvinte"
        // quando o componente for desmontado para evitar vazamento de memória.
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return(
        <header className="flex justify-between items-center py-3 px-6 bg-white border-b border-gray-200">
            {/* Logo e Nome da Clínica */}
            <div className="flex items-center gap-4">
                {theme.logo ? (
                    <img src={theme.logo} alt="Logo da Clinica" className="w-10 h-10 rounded-full object-cover"/>
                ) : (
                <figure className="w-10 h-10 background-color: var(--primary-color)] rounded-full flex items-center justify-center">
                    {/* SVG da logo aqui */}
                    <span className="text-white font-bold text-xl">
                        {theme.clinicName
                            ? theme.clinicName.charAt(0).toUpperCase()
                            : "C"}    
                    </span> 
                </figure>
                )}

                <h1 className="hidden sm:block text-xl font-bold color: var (--primary-color)]">
                    {theme.clinicName || "MedFast"}
                </h1>
            </div>

            {/* Menu */}
            <nav className="justify-start">
                <ul className="flex gap-6 text-primary justify-start">
                        <li><Link to="/buscar-medico" className="hover:underline">Agendar</Link></li>
                        <li><Link to="/minhas-consultas" className="hover:underline">Minhas consultas</Link></li>
                </ul>
            </nav>
            
            {/* Menu do Usuário */}
            <div className="relative" ref={dropdownRef}>
                <button 
                    type="button"
                    className="flex items-center gap-4 p-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    onClick={handleToggleDropdown}
                    aria-haspopup="true" // Acessibilidade: diz que tem um menu
                    aria-expanded={isDropdownOpen} // Acessibilidade: diz se está aberto
                >
                    {/* ... Conteúdo do botão (Nome, Avatar, Seta) ... */}
                    <div className="text-left hidden md:block">
                        <p className="text-xs text-gray-500">Bem vindo,</p>
                        <p className="text-sm font-semibold text-gray-800 p-0 m-0">
                            {user?.nomeCompleto || user?.nome || "Usuário"}
                        </p>
                    </div>
                    <img
                        src={
                            user?.fotoUrl || user?.avatarUrl || user?.foto || '/equipe-medica.png'
                        }
                        alt={user?.nome || 'Foto do usuário'}
                        className="w-10 h-10 rounded-full object-cover border-2 border-color (--primary-color)]"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/equipe-medica.png'; }}
                    />
                    <FaChevronDown 
                        className={`text-gray-400 transition-transform duration-200 ${
                            isDropdownOpen ? 'rotate-180' : ''
                        }`} 
                    />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <Link
                            to="/meu-perfil"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={handleCloseDropdown} // Fecha ao navegar
                        >
                            <FaUser className="text-gray-400" />
                            Meu Perfil
                        </Link>
                        
                        <button
                            onClick={() => {
                                logout();
                                handleCloseDropdown(); // Fecha após clicar
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <FaSignOutAlt className="text-gray-400" />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}