import { useState, useEffect } from 'react';
import { FaHeadphones } from 'react-icons/fa';
import DashboardTabContent from '../../components/Admin/DashboardTabContent/DashboardTabContent';
import MedicosTabContent from '../../components/Admin/MedicosTabContent/MedicosTabContent';
import AgendamentosTabContent from '../../components/Admin/AgendamentosTabContent/AgendamentosTabContent';
import PersonalizacaoTabContent from '../../components/Admin/PersonalizacaoTabContent/PersonalizacaoTabContent';
import { appointments as mockAppointments } from '../../utils/mocks/appointments';
import { stats as mockStats } from '../../utils/mocks/stats';
import DashboardSkeleton from '../../components/Admin/DashboardSkeleton/DashboardSkeleton';
import api from '../../api/axiosConfig';
import { appointmentService } from '../../services/appointmentService';
import SecretariasTabContent from '../../components/Admin/SecretariasTabContent/SecretariasTabContent';

// Toggle to show/hide the "Secretárias" tab without deleting code
const showSecretarias = false;

const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'medicos', label: 'Médicos' },
    ...(showSecretarias ? [{ id: 'secretarias', label: 'Secretárias' }] : []),
    { id: 'agendamentos', label: 'Agendamentos' },
    { id: 'personalizacao', label: 'Personalização' },
];

export default function DashboardScreen() {
    const [abaAtiva, setAbaAtiva] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        
        // Defina como 'false' para usar a chamada real da API
        const useMockData = false; 

        try {
            if (useMockData) {
                // --- SIMULAÇÃO DA CHAMADA DA API USANDO OS MOCKS ---
                console.log("Simulando busca de dados...");
                // Simula o tempo de espera da rede
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Para testar o estado de erro, descomente a linha abaixo:
                // throw new Error("Falha forçada na simulação");

                setStats(mockStats);
                setAppointments(mockAppointments);
                console.log("Dados (mock) recebidos!");

            } else {
                // --- CÓDIGO REAL DE CHAMADA DA API ---
                console.log("Buscando dados da API real...");
                
                try {
                    // Buscar agendamentos reais da API
                    console.log("🔄 Tentando buscar agendamentos da API...");
                    const appointmentsData = await appointmentService.getAllAppointments();
                    setAppointments(appointmentsData); // API agora retorna array direto
                    console.log("✅ Agendamentos da API recebidos com sucesso:", appointmentsData);
                } catch (appointmentsError) {
                    console.error("❌ ERRO ao buscar agendamentos da API:", appointmentsError);
                    console.warn("⚠️ Usando dados mock como fallback");
                    setAppointments(mockAppointments);
                }
                
                // Por enquanto, usar stats mock (você pode implementar a API de stats depois)
                setStats(mockStats);
                
                console.log("Dados (API) recebidos!");
            }
        } catch (err) {
            // Se a chamada real ou a simulação falhar, o erro será capturado aqui
            console.error("Erro ao buscar dados:", err);
            setError("Não foi possível carregar as informações. Por favor, tente novamente.");
        } finally {
            // O `finally` é sempre executado, garantindo que o estado de 'loading' 
            // seja desativado, não importa se a operação teve sucesso ou falhou.
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); 

    if (loading) {
        return <DashboardSkeleton />
    }

    return (
        <div className="w-full gap-8 mt-6 bg-white p-6 rounded-lg shadow-md">
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl mb-2">Painel Administrativo</h2>
                    <p className="text-muted-foreground">Gerencie sua clínica e profissionais</p>
                </div>
                <button
                    className="flex items-center gap-2 p-2 px-4 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer"
                >
                    <FaHeadphones className="h-4 w-4" />
                    <span>Suporte</span>
                </button>
            </div>

            <div>
                <div className="flex border-b border-[var(--primary-color)] w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setAbaAtiva(tab.id)}
                            className={`py-2 px-4 text-center font-medium ${abaAtiva === tab.id ? 'border-b-2 border-[var(--primary-color)] text-primary' : 'text-gray-500'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="mt-6 p-4">
                    {abaAtiva === 'dashboard' && <DashboardTabContent stats={stats} appointments={appointments} />}
                    {abaAtiva === 'medicos' && <MedicosTabContent />}
                    {abaAtiva === 'secretarias' && <SecretariasTabContent />}
                    {abaAtiva === 'agendamentos' && <AgendamentosTabContent appointments={appointments} />}
                    {abaAtiva === 'personalizacao' && <PersonalizacaoTabContent />}
                </div>
            </div>
        </div>
    );
}