import { FaCalendar, FaClock } from 'react-icons/fa';

// Objeto que mapeia o status para as classes de estilo correspondentes
const statusStyles = {
    AGENDADO: 'bg-blue-100 text-blue-800',
    CONFIRMADO: 'bg-green-100 text-green-800',
    REALIZADO: 'bg-gray-100 text-gray-800',
    CANCELADO: 'bg-red-100 text-red-800',
    FALTOU: 'bg-orange-100 text-orange-800',
    // Manter compatibilidade com dados mock antigos
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800',
};

// Objeto que mapeia o status para o texto a ser exibido
const statusText = {
    AGENDADO: 'Agendado',
    CONFIRMADO: 'Confirmado',
    REALIZADO: 'Realizado',
    CANCELADO: 'Cancelado',
    FALTOU: 'Faltou',
    // Manter compatibilidade com dados mock antigos
    confirmed: 'Confirmada',
    pending: 'Pendente',
    cancelled: 'Cancelada',
};

export default function AppointmentCard({ appointment }) {
    // Compatibilidade com estrutura da API e mock
    const patient = appointment.patient || appointment.paciente?.nomeCompleto;
    const doctor = appointment.doctor || appointment.medico?.nomeCompleto;
    const specialty = appointment.specialty || appointment.medico?.especialidade;
    const date = appointment.date || appointment.dataConsultaInicio;
    const time = appointment.time || (appointment.dataConsultaInicio ? 
        new Date(appointment.dataConsultaInicio).toLocaleTimeString('pt-BR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        }) : null);
    const status = appointment.status;

    return (
        <div className={`flex items-center justify-between p-4 border rounded-lg bg-white ${status === 'CANCELADO' || status === 'cancelled' ? 'opacity-60' : ''}`}>
            <div className="space-y-1">
                <h4 className={`font-semibold ${(status === 'CANCELADO' || status === 'cancelled') ? 'line-through' : ''}`}>
                    {patient || 'Paciente não informado'}
                </h4>
                <p className="text-sm text-gray-500">
                    {doctor || 'Médico não informado'} {specialty ? ` - ${specialty}` : ''}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                    <FaCalendar className="h-4 w-4 mr-1.5" />
                    {date ? new Date(date).toLocaleDateString('pt-BR') : 'Data não informada'}
                    <FaClock className="h-4 w-4 ml-4 mr-1.5" />
                    {time || 'Hora não informada'}
                </div>
            </div>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || statusStyles.default}`}>
                {statusText[status] || status}
            </span>
        </div>
    );
}