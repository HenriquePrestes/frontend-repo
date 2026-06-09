import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from '../../components/DatePicker/DatePicker';
import TimeSlotPicker from '../../components/TimeSlotPicker/TimeSlotPicker';
import Confirmation from '../../components/Confirmation/Confirmation';

import { doctors as mockDoctors } from '../../utils/mocks/doctors'; 
import { getAvailableTimes } from '../../utils/mocks/api'; 

export default function ScheduleAppointment() {
    const { doctorId } = useParams(); // Pega o ID do médico da URL
    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [loadingTimes, setLoadingTimes] = useState(false);

    useEffect(() => {
        const currentDoctor = mockDoctors.find(d => d.id.toString() === doctorId);
        setDoctor(currentDoctor);
    }, [doctorId]);

    // Efeito para buscar horários quando uma data é selecionada
    useEffect(() => {
        if (selectedDate) {
            setLoadingTimes(true);
            setAvailableTimes([]); // Limpa horários antigos
            setSelectedTime(null); // Reseta a seleção de horário
            
            // Simula uma chamada de API
            getAvailableTimes(doctorId, selectedDate).then(times => {
                setAvailableTimes(times);
                setLoadingTimes(false);
            });
        }
    }, [selectedDate, doctorId]);

    if (!doctor) {
        return <div>Carregando informações do médico...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8 mt-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-primary-dark">Agendar Consulta</h1>
                <p className="text-lg text-gray-600">com <span className="font-bold">{doctor.name}</span> - {doctor.specialty}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Coluna da Esquerda: Seleção de Data */}
                <DatePicker 
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                />

                {/* Coluna da Direita: Seleção de Horário (só aparece se uma data for selecionada) */}
                {selectedDate && (
                    <TimeSlotPicker 
                        isLoading={loadingTimes}
                        availableTimes={availableTimes}
                        selectedTime={selectedTime}
                        onTimeSelect={setSelectedTime}
                    />
                )}
            </div>

            {/* Seção de Confirmação (só aparece se data e hora forem selecionadas) */}
            {selectedDate && selectedTime && (
                <Confirmation 
                    doctor={doctor}
                    date={selectedDate}
                    time={selectedTime}
                />
            )}
        </div>
    );
}