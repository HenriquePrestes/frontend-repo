import { useEffect, useState } from 'react';
import { FaStethoscope, FaUserMd, FaIdCard, FaSearch } from 'react-icons/fa';
import { especialidadeService } from '../../services/especialidadeService';

export default function DoctorsFilter({ onFilter }) {
    const [especialidades, setEspecialidades] = useState([]);
    const [loadingEspecialidades, setLoadingEspecialidades] = useState(true);
    const [filtros, setFiltros] = useState({
        especialidade: '',
        nome: '',
        crm: ''
    });

    const inputContainerStyle = "relative flex items-center";
    
    const inputStyle = "w-full p-3 pl-10 border border-gray-300 bg-white rounded-lg focus:outline-none focus:border-primary transition-colors";

    const iconStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400";

    useEffect(() => {
        fetchEspecialidades();
    }, []);

    const fetchEspecialidades = async () => {
        try {
            setLoadingEspecialidades(true);
            const data = await especialidadeService.getAllEspecialidades();
            setEspecialidades(data);
        } catch (error) {
            console.error("Erro ao buscar especialidades:", error);
            setEspecialidades([]);
        } finally {
            setLoadingEspecialidades(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFiltros(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSearch = () => {
        if (onFilter) {
            // Remove campos vazios e mapeia os nomes dos campos para o backend
            const filtrosLimpos = {};
            Object.keys(filtros).forEach(key => {
                if (filtros[key] && filtros[key].trim() !== '') {
                    // Mapeia 'nome' para 'nome' que o backend espera
                    if (key === 'nome') {
                        filtrosLimpos['nome'] = filtros[key];
                    } else {
                        filtrosLimpos[key] = filtros[key];
                    }
                }
            });
            console.log("Enviando filtros para busca:", filtrosLimpos);
            onFilter(filtrosLimpos);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleClearFilters = () => {
        setFiltros({
            especialidade: '',
            nome: '',
            crm: ''
        });
        // Chama onFilter com filtros vazios para resetar a busca
        if (onFilter) {
            onFilter(null);
        }
    };

    return(
        <section>
        <div className="bg-accent p-6 rounded-xl">
            <h2 className="text-xl font-bold text-primary-dark mb-5">Busque por um especialista</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                {/* Filtro de Especialidade */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="specialty" className="font-semibold text-sm text-gray-700">Especialidade</label>
                    <div className={inputContainerStyle}>
                        <FaStethoscope className={iconStyle} />
                        <select 
                            name="specialty" 
                            id="specialty" 
                            className={inputStyle}
                            value={filtros.especialidade}
                            onChange={(e) => handleInputChange('especialidade', e.target.value)}
                            disabled={loadingEspecialidades}
                        >
                            <option value="">
                                {loadingEspecialidades ? "Carregando..." : "Todas as especialidades"}
                            </option>
                            {especialidades.map(esp => (
                                <option key={esp.id} value={esp.nome}>
                                    {esp.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Filtro de Nome */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="doctorName" className="font-semibold text-sm text-gray-700">Nome do médico</label>
                    <div className={inputContainerStyle}>
                        <FaUserMd className={iconStyle} />
                        <input 
                            type="text" 
                            id="doctorName" 
                            name="doctorName" 
                            className={inputStyle} 
                            placeholder="Digite o nome do médico" 
                            value={filtros.nome}
                            onChange={(e) => handleInputChange('nome', e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                </div>

                {/* Filtro de CRM */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="crm" className="font-semibold text-sm text-gray-700">CRM</label>
                    <div className={inputContainerStyle}>
                        <FaIdCard className={iconStyle} />
                        <input 
                            type="text" 
                            id="crm" 
                            name="crm" 
                            className={inputStyle} 
                            placeholder="Digite o CRM"
                            value={filtros.crm}
                            onChange={(e) => handleInputChange('crm', e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                </div>

                {/* Botão de Busca */}
                <button 
                    onClick={handleSearch}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300 h-[50px]"
                >
                    <FaSearch />
                    Buscar
                </button>

                {/* Botão de Limpar Filtros */}
                <button 
                    onClick={handleClearFilters}
                    className="w-full flex items-center justify-center gap-2 bg-gray-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300 h-[50px]"
                >
                    Limpar
                </button>
            </div>
        </div>
        </section>
    )
}