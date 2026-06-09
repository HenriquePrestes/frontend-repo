import { FaCalendar, FaClock, FaUsers, FaChartBar } from 'react-icons/fa';
import StatCard from '../StatCard/StatCard';
import AppointmentCard from '../AppointmentCard/AppointmentCard';

export default function DashboardTabContent({ stats, appointments }) {
    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total de Consultas"
                    value={stats?.totalAppointments ?? 0}
                    description="Este mês"
                    icon={<FaCalendar className="h-4 w-4 text-gray-400" />}
                />

                <StatCard
                    title="Consultas Hoje"
                    value={stats?.todayAppointments ?? 0}
                    description="Agendadas para hoje"
                    icon={<FaClock className="h-4 w-4 text-gray-400" />}
                />

                <StatCard
                    title="Médicos Ativos"
                    value={stats?.activeDoctors ?? 0}
                    description="Profissionais cadastrados"
                    icon={<FaUsers className="h-4 w-4 text-gray-400" />}
                />

                <StatCard
                    title="Pendentes"
                    value={stats?.pendingAppointments ?? 0}
                    description="Aguardando confirmação"
                    icon={<FaChartBar className="h-4 w-4 text-gray-400" />}
                />

            </div>

            {/* Recent Appointments */}
            <div className="p-4 bg-gray-50 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Agendamentos Recentes</h3>
                <div className="space-y-4">
                    {appointments.slice(0, 5).map(appointment => (
                        <AppointmentCard 
                            key={appointment.id} 
                            appointment={appointment} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}