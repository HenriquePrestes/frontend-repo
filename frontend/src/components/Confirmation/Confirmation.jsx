import { FaCalendarAlt, FaClock, FaUserMd } from 'react-icons/fa';

export default function Confirmation({ doctor, date, time }) {
    const formattedDate = date.toLocaleDateString('pt-BR', {
        weekday: 'long', day: 'numeric', month: 'long'
    });

    return (
        <div className="bg-accent p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-primary-dark mb-4">3. Confirmação de marcação</h2>
            <div className="bg-white p-4 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="flex items-center gap-3">
                    <FaUserMd className="text-primary text-xl" />
                    <div>
                        <p className="text-sm text-gray-500">Médico(a)</p>
                        <p className="font-bold">{doctor.name}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-primary text-xl" />
                    <div>
                        <p className="text-sm text-gray-500">Data</p>
                        <p className="font-bold capitalize">{formattedDate}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <FaClock className="text-primary text-xl" />
                    <div>
                        <p className="text-sm text-gray-500">Horário</p>
                        <p className="font-bold">{time}</p>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <button className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors">
                    Confirmar Agendamento
                </button>
            </div>
        </div>
    );
}