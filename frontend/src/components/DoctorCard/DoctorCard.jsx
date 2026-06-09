import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import Person2Icon from "@mui/icons-material/Person2";
import { Link } from "react-router-dom";

function DoctorCard({ doctor }) {
    const [isFavorite, setIsFavorite] = useState(false);

    const getFavorites = () => {
        const favorites = localStorage.getItem("doctorFavorites");
        return favorites ? JSON.parse(favorites) : [];
    };

    useEffect(() => {
        const favorites = getFavorites();
        const isFavorite = favorites.some((fav) => fav.id === doctor.id);
        setIsFavorite(isFavorite);
    }, [doctor.id]);

    const toggleFavorite = (e) => {
        e.stopPropagation();
        let favorites = getFavorites();
        if (favorites.some((fav) => fav.id === doctor.id)) {
            favorites = favorites.filter((fav) => fav.id !== doctor.id);
            setIsFavorite(false);
        } else {
            favorites.push(doctor);
            setIsFavorite(true);
        }
        localStorage.setItem("doctorFavorites", JSON.stringify(favorites));
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 transform flex flex-col">
            <div className="relative h-28 bg-linear-to-r from-primary to-primary-dark">
                <button
                    onClick={toggleFavorite}
                    className="absolute top-3 right-3 bg-black/30 p-2 rounded-full text-white hover:bg-black/50 transition-colors z-10"
                    aria-label="Favoritar médico"
                >
                    <FaStar color={isFavorite ? "#FFD700" : "white"} size={20} />
                </button>
            </div>

            <div className="flex justify-center -mt-16 relative z-0">
                {(doctor.photo || doctor.foto) ? (
                    <img
                        src={doctor.photo || doctor.foto}
                        alt={`Foto de ${doctor.name || doctor.nomeCompleto}`}
                        className="w-[100px] h-[100px] rounded-full border-4 border-white object-cover shadow-md"
                    />
                ) : (
                    <div className="w-[100px] h-[100px] rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-md text-gray-500">
                        <Person2Icon style={{ fontSize: 70 }} />
                    </div>
                )}
            </div>

            {/* Informações do Médico */}
            <div className="p-5 pt-3 text-center grow">
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {doctor.name || doctor.nomeCompleto || "Nome não informado"}
                </h2>
                <p className="text-primary font-semibold mb-2">
                    {(() => {
                        // Verifica se existe doctor.specialty (formato antigo)
                        if (doctor.specialty) return doctor.specialty;
                        
                        // Verifica se especialidade é um objeto com nome
                        if (doctor.especialidade && typeof doctor.especialidade === 'object' && doctor.especialidade.nome) {
                            return doctor.especialidade.nome;
                        }
                        
                        // Verifica se especialidade é uma string
                        if (doctor.especialidade && typeof doctor.especialidade === 'string') {
                            return doctor.especialidade;
                        }
                        
                        // Fallback
                        return "Especialidade não informada";
                    })()}
                </p>
                <p className="text-sm text-gray-600">
                    CRM: {doctor.crm || "Não informado"}
                </p>
            </div>

            {/* Botão de Ação */}
            <Link
                to={`/agendar/${doctor.id}`}
                state={{ medico: doctor }}
                className="p-4 bg-accent/30"
            >
                <button className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300">
                    Agendar Consulta
                </button>
            </Link>
        </div>
    );
}

export default DoctorCard;
