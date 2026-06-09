import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isBefore,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import TimeSlotPicker from "../../components/TimeSlotPicker/TimeSlotPicker";
import { appointmentService } from "../../services/appointmentService";
import { useAuth } from "../../hooks/auth/useAuth";

export default function MonthlyDateSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const medicoSelecionado = location.state?.medico; // Recebe os dados do médico
  const { user } = useAuth(); // Obtém os dados do usuário autenticado

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [observations, setObservations] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [savingAppointment, setSavingAppointment] = useState(false);
  // availableTimes will be computed from the selected doctor's horariosTrabalho
  const [availableTimes, setAvailableTimes] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(true);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const calendarStart = startOfWeek(monthStart, { locale: ptBR });
  const calendarEnd = endOfWeek(monthEnd, { locale: ptBR });
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDayClick = (day) => {
    const today = startOfDay(new Date());
    const dayToCheck = startOfDay(day);
    
    if (isSameMonth(day, currentMonth) && !isBefore(dayToCheck, today)) {
      setSelectedDate(day);
      setSelectedTime(null);
    }
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  // ---- Helpers to compute time slots from medico.horariosTrabalho ----
  const dayOfWeekEnumFromDate = (date) => {
    // JS getDay(): 0 = Sunday, 1 = Monday, ... 6 = Saturday
    const map = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ];
    return map[date.getDay()];
  };

  const parseTimeToMinutes = (timeStr) => {
    // Accepts "HH:mm:ss" or "HH:mm"
    if (!timeStr) return null;
    const parts = timeStr.split(":");
    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    return h * 60 + m;
  };

  const minutesToHHMM = (minutes) => {
    const h = Math.floor(minutes / 60).toString().padStart(2, "0");
    const m = (minutes % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const generateSlotsForHorario = (horario, duration) => {
    const start = parseTimeToMinutes(horario.horaInicio);
    const end = parseTimeToMinutes(horario.horaFim);
    if (start === null || end === null || duration <= 0) return [];
    const slots = [];
    for (let t = start; t + duration <= end; t += duration) {
      slots.push(minutesToHHMM(t));
    }
    return slots;
  };

  // Recompute availableTimes when selectedDate or medicoSelecionado changes
  useEffect(() => {
    const computeSlots = () => {
      setSlotsLoading(true);
      try {
        if (!selectedDate || !medicoSelecionado) {
          setAvailableTimes([]);
          return;
        }

        const dayEnum = dayOfWeekEnumFromDate(selectedDate);
        const horarios = medicoSelecionado.horariosTrabalho || medicoSelecionado.horarios || [];
        const duration = medicoSelecionado.duracaoConsultaMinutos || medicoSelecionado.duration || 30;

        // Filter horarios that match the day of week
        const matched = horarios.filter((h) => {
          // diaSemana may be provided as 'MONDAY' or as lowercase
          const dia = (h.diaSemana || h.day || "").toString().toUpperCase();
          return dia === dayEnum;
        });

        // For each matched horario, generate slots and merge
        const allSlots = [];
        matched.forEach((h) => {
          const slots = generateSlotsForHorario(h, duration);
          slots.forEach((s) => allSlots.push(s));
        });

        // deduplicate and sort
        let unique = Array.from(new Set(allSlots)).sort((a, b) => {
          return parseTimeToMinutes(a) - parseTimeToMinutes(b);
        });

        // Filter out past times if selected date is today
        const today = startOfDay(new Date());
        const selectedDay = startOfDay(selectedDate);
        
        if (selectedDay.getTime() === today.getTime()) {
          // Se a data selecionada é hoje, filtrar horários passados
          const now = new Date();
          const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
          
          unique = unique.filter(timeSlot => {
            const slotTimeInMinutes = parseTimeToMinutes(timeSlot);
            // Permitir apenas horários que são pelo menos 15 minutos no futuro
            return slotTimeInMinutes > (currentTimeInMinutes + 15);
          });
        }

        setAvailableTimes(unique);
      } finally {
        setSlotsLoading(false);
      }
    };

    computeSlots();
  }, [selectedDate, medicoSelecionado]);

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      alert("Por favor, selecione uma data e horário!");
      return;
    }

    setShowConfirmation(true);
  };

  const handleFinalConfirm = async () => {
    setSavingAppointment(true);
    try {
      // Preparar os dados do agendamento
      const [hours, minutes] = selectedTime.split(':');
      const dataConsultaInicio = new Date(selectedDate);
      dataConsultaInicio.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Obter o paciente ID do usuário autenticado via JWT
      if (!user || !user.id) {
        alert("Erro: Usuário não autenticado. Faça login novamente.");
        navigate("/login");
        return;
      }
      
      const pacienteId = user.id; // O ID do usuário está no campo 'id' do JWT

      // Formatar a data no formato esperado pelo backend (LocalDateTime sem timezone)
      const year = dataConsultaInicio.getFullYear();
      const month = String(dataConsultaInicio.getMonth() + 1).padStart(2, '0');
      const day = String(dataConsultaInicio.getDate()).padStart(2, '0');
      const hour = String(dataConsultaInicio.getHours()).padStart(2, '0');
      const minute = String(dataConsultaInicio.getMinutes()).padStart(2, '0');
      const second = String(dataConsultaInicio.getSeconds()).padStart(2, '0');
      
      const dataFormatada = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

      const agendamentoData = {
        pacienteId: pacienteId, // user.id já é um número do JWT
        medicoId: medicoSelecionado.id,
        dataConsultaInicio: dataFormatada,
        observacoes: observations || null
      };

      console.log("Enviando dados do agendamento:", agendamentoData);

      // Fazer a requisição para o backend
      const response = await appointmentService.scheduleAppointment(agendamentoData);
      
      console.log("Agendamento criado com sucesso:", response);
      
      // Mostrar mensagem de sucesso
      alert("Consulta agendada com sucesso!");

      // Redirecionar para a página de consultas do paciente
      navigate("/minhas-consultas");
      
    } catch (error) {
      console.error("Erro ao agendar consulta:", error);
      
      // Mostrar mensagem de erro detalhada
      const errorMessage = error.response?.data || error.message || "Erro desconhecido ao agendar consulta";
      alert(`Erro ao agendar consulta: ${errorMessage}`);
    } finally {
      setSavingAppointment(false);
    }
  };

  // Navega para a visão semanal: usa a rota existente /agendar/:doctorId com state.view = 'weekly'
  // Se não conseguirmos obter um id do médico, cai para a lista de médicos (`/buscar-medico`).
  const onNavigateToWeekly = (medico) => {
    if (!medico) {
      navigate("/buscar-medico");
      return;
    }

    // Tenta obter um identificador razoável do objeto médico
    const doctorId = medico.id ?? medico.doctorId ?? medico.crm ?? medico._id;

    if (doctorId) {
      navigate(`/agendar/${encodeURIComponent(doctorId)}`, {
        state: { medico, view: "weekly" },
      });
    } else {
      // fallback: se não houver id, levar à busca para escolher médico
      navigate("/buscar-medico");
    }
  };

  // Tela de confirmação
  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-[rgba(59,120,104,1)] flex items-center justify-center p-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
          {/* Botão voltar no topo */}
          <button
            onClick={() => setShowConfirmation(false)}
            className="mb-4 text-sm text-[rgba(59,120,104,1)] hover:underline flex items-center gap-1 font-medium"
          >
            <FaChevronLeft size={14} />
            Voltar
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Confirmar Agendamento
            </h2>
            <p className="text-gray-600">
              Revise os detalhes do seu agendamento
            </p>
          </div>

          <div className="space-y-4 mb-6">
            {/* Informações do Médico */}
            {medicoSelecionado && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Médico</p>
                <p className="font-semibold text-gray-800">
                  {medicoSelecionado.nomeCompleto || medicoSelecionado.name || "Nome não informado"}
                </p>
                <p className="text-sm text-gray-600">
                  {medicoSelecionado.especialidade || medicoSelecionado.specialty || "Especialidade não informada"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  CRM: {medicoSelecionado.crm || "Não informado"}
                </p>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Data</p>
              <p className="font-semibold text-gray-800">
                {format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Horário</p>
              <p className="font-semibold text-gray-800">{selectedTime}</p>
            </div>

            {observations && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Observações</p>
                <p className="text-gray-800">{observations}</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleFinalConfirm}
              disabled={savingAppointment}
              className="w-full bg-[rgba(59,120,104,1)] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[rgba(49,100,87,1)] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {savingAppointment ? "Agendando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgba(59,120,104,1)] flex items-center justify-center p-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        {/* Botão voltar - só aparece quando NÃO tem data selecionada */}
        {!selectedDate && (
          <a
            href="/buscar-medico"
            className="mb-4 text-sm text-[rgba(59,120,104,1)] hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <FaChevronLeft size={14} />
            Voltar
          </a>
        )}

        {/* Botão voltar ao calendário - só aparece quando tem data selecionada */}
        {selectedDate && (
          <button
            onClick={() => setSelectedDate(null)}
            className="mb-4 text-sm text-[rgba(59,120,104,1)] hover:underline flex items-center gap-1 font-medium"
          >
            <FaChevronLeft size={14} />
            Voltar ao calendário
          </button>
        )}

        <h2 className="text-xl font-bold text-center mb-4">
          Agende sua Consulta
        </h2>

        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xs text-gray-600 mr-1">→ Visão: Mensal</span>
          <button className="px-3 py-1.5 text-sm bg-[rgba(59,120,104,1)] text-white rounded font-medium">
            Mensal
          </button>
          <button
            onClick={() => {
              if (onNavigateToWeekly) {
                onNavigateToWeekly(medicoSelecionado);
              } else {
                console.log("Navegando para visão semanal...");
                // Quando tiver a rota configurada:
                // navigate('/agendar-semanal', { state: { medico: medicoSelecionado } })
              }
            }}
            className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium"
          >
            Semanal
          </button>
        </div>

        {!selectedDate && (
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            >
              <FaChevronLeft className="text-gray-600 text-sm" />
            </button>
            <span className="font-bold text-base">
              {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            >
              <FaChevronRight className="text-gray-600 text-sm" />
            </button>
          </div>
        )}

        {!selectedDate && (
          <div className="mb-4">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {weekDays.map((day) => (
                    <th
                      key={day}
                      className="text-center pb-2 text-sm font-bold text-gray-500 w-[14.28%]"
                    >
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, weekIndex) => (
                  <tr key={weekIndex}>
                    {week.map((day, dayIndex) => {
                      const isCurrentMonth = isSameMonth(day, currentMonth);
                      const today = startOfDay(new Date());
                      const dayToCheck = startOfDay(day);
                      const isPastDate = isBefore(dayToCheck, today);
                      const isDisabled = !isCurrentMonth || isPastDate;
                      
                      return (
                        <td key={dayIndex} className="p-1 w-[14.28%]">
                          <button
                            onClick={() => handleDayClick(day)}
                            disabled={isDisabled}
                            className={`
                              w-full aspect-square flex items-center justify-center text-base font-medium rounded
                              transition-colors
                              ${
                                isDisabled
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-800 hover:bg-[rgba(59,120,104,1)] hover:text-white cursor-pointer"
                              }
                            `}
                          >
                            {format(day, "d")}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Escolha o horário
              </label>
              <p className="text-xs text-gray-400 italic">
                Selecione um dia do calendário
              </p>
            </div>
          </div>
        )}

        {selectedDate && (
          <div className="mb-4">
            <p className="text-center font-semibold text-gray-800 mb-4 text-base">
              {format(selectedDate, "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </p>

            <TimeSlotPicker
              isLoading={slotsLoading}
              availableTimes={availableTimes}
              selectedTime={selectedTime}
              onTimeSelect={handleTimeClick}
            />
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Observações
          </label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder={
              selectedDate
                ? "Digite suas observações (opcional)"
                : "Selecione um dia do calendário"
            }
            disabled={!selectedDate}
            className="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(59,120,104,1)] resize-none disabled:bg-gray-100 disabled:text-gray-500"
            rows="2"
          />
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime}
          className="w-full bg-[rgba(59,120,104,1)] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[rgba(49,100,87,1)] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Confirmar Agendamento
        </button>
      </div>
    </div>
  );
}
