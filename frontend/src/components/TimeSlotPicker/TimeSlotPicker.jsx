export default function TimeSlotPicker({ isLoading, availableTimes, selectedTime, onTimeSelect }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-primary-dark mb-4">2. Selecione um horário</h2>
            {isLoading ? (
                <div>Carregando horários...</div>
            ) : availableTimes.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                    {availableTimes.map(time => (
                        <button
                            key={time}
                            onClick={() => onTimeSelect(time)}
                            className={`p-2 rounded-lg text-center font-semibold transition-colors
                                ${selectedTime === time 
                                    ? 'bg-primary text-white' 
                                    : 'bg-accent hover:bg-primary hover:text-white'
                                }`}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-gray-500">Nenhum horário disponível para esta data.</div>
            )}
        </div>
    );
}