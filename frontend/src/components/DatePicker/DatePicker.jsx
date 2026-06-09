import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ptBR } from 'date-fns/locale';

export default function DatePicker({ selectedDate, onDateSelect }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col">
            <h2 className="text-lg font-bold text-primary-dark mb-4">1. Selecione uma data</h2>
            <div className="mx-auto">
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={onDateSelect}
                    locale={ptBR}
                    hidden={{ before: new Date() }} // Impede seleção de datas passadas
                    styles={{
                        caption: { color: '#2C5A4D' },
                        head: { color: '#3B7868' },
                    }}
                    modifiersClassNames={{
                        selected: 'rdp-day_selected',
                    }}
                />
            </div>
            {/* CSS customizado para a cor de seleção */}
            {/* TODO: Alterar aqui depois */}
            <style>{`
                .rdp-day_selected { 
                    background-color: #3B7868 !important;
                    color: white !important;
                }
            `}</style>
        </div>
    );
}