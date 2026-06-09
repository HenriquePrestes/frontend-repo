import AppointmentCard from '../AppointmentCard/AppointmentCard';

export default function AgendamentosTabContent({ appointments }) {
    return (
        <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg shadow">
                <div className='mb-4'>
                    <h3 className="text-lg font-semibold">Todos os Agendamentos</h3>
                    <p className="text-sm text-gray-500">Gerencie todas as consultas da clínica</p>
                </div>
                
                <div className="space-y-4">
                    {appointments && appointments.length > 0 ? (
                        appointments.map(appointment => (
                            <AppointmentCard 
                                key={appointment.id} 
                                appointment={appointment} 
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">Nenhum agendamento encontrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
}