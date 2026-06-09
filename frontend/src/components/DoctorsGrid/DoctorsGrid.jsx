import { useEffect, useState } from "react"
import DoctorCard from "../DoctorCard/DoctorCard"
import { doctorService } from "../../services/doctorService"

export default function DoctorsGrid({ filters }) {
    const [doctorsInfo, setDoctorsInfo] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    useEffect(() => {
        fetchDoctors();
    }, [filters]); // Re-executa quando os filtros mudam

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log("DoctorsGrid: Buscando médicos com filtros:", filters);
            
            let data;
            
            // Se há filtros, usa o endpoint com paginação que suporta filtros
            if (filters && Object.keys(filters).length > 0) {
                console.log("DoctorsGrid: Usando endpoint com filtros");
                data = await doctorService.getDoctors(filters);
                console.log("DoctorsGrid: Dados recebidos com filtros:", data);
                
                if (data && data.content && Array.isArray(data.content)) {
                    console.log("DoctorsGrid: Primeiro médico dos dados filtrados:", data.content[0]);
                    setDoctorsInfo(data.content);
                } else if (Array.isArray(data)) {
                    console.log("DoctorsGrid: Primeiro médico dos dados (array direto):", data[0]);
                    setDoctorsInfo(data);
                } else {
                    console.error("DoctorsGrid: Formato de resposta não reconhecido");
                    console.log("DoctorsGrid: Dados recebidos:", data);
                    setDoctorsInfo([]);
                }
            } else {
                // Sem filtros, tenta primeiro o endpoint simples
                try {
                    data = await doctorService.getAllDoctors();
                    console.log("DoctorsGrid: Dados recebidos via /all:", data);
                    
                    if (Array.isArray(data)) {
                        console.log("DoctorsGrid: Primeiro médico via /all:", data[0]);
                        setDoctorsInfo(data);
                        return;
                    }
                } catch (allError) {
                    console.log("DoctorsGrid: Endpoint /all falhou, tentando paginado:", allError.message);
                }
                
                // Se falhar, tenta o endpoint paginado sem filtros
                data = await doctorService.getDoctors();
                console.log("DoctorsGrid: Dados recebidos via paginação:", data);
                
                if (data && data.content && Array.isArray(data.content)) {
                    setDoctorsInfo(data.content);
                } else if (Array.isArray(data)) {
                    setDoctorsInfo(data);
                } else {
                    console.error("DoctorsGrid: Formato de resposta não reconhecido");
                    setDoctorsInfo([]);
                }
            }
            
        } catch (error) {
            console.error("DoctorsGrid: Erro ao buscar médicos:", error);
            setError("Erro ao carregar médicos. Tente novamente.");
            setDoctorsInfo([]);
        } finally {
            setLoading(false);
        }
    }; 

    if (loading) {
        return (
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Médicos Disponíveis</h2>
                <div className="flex justify-center items-center py-12">
                    <p className="text-gray-500 text-lg">Carregando médicos...</p>
                </div>
            </section>
        )
    }

    if (error) {
        return (
            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Médicos Disponíveis</h2>
                <div className="flex justify-center items-center py-12">
                    <p className="text-red-500 text-lg">{error}</p>
                </div>
            </section>
        )
    }

    return(
        <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Médicos Disponíveis</h2>
            {doctorsInfo.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                    <p className="text-gray-500 text-lg">Nenhum médico encontrado.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {doctorsInfo.map((doctorInfo) => (
                        <DoctorCard key={doctorInfo.id} doctor={doctorInfo} />
                    ))}
                </div>
            )}
        </section>
    )
}