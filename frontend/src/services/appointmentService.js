import api from '../api/axiosConfig';

export const appointmentService = {
    // GET - Buscar todos os agendamentos (para admin)
    getAllAppointments: async () => {
        const response = await api.get('/api/agendamentos/admin');
        return response.data;
    },

    // GET - Buscar agendamentos do paciente
    getMyAppointments: async (pacienteId) => {
        const response = await api.get(`/api/agendamentos/paciente/${pacienteId}`);
        return response.data;
    },

    // POST - Agendar nova consulta
    scheduleAppointment: async (appointmentData) => {
        const response = await api.post('/api/agendamentos', appointmentData);
        return response.data;
    },

    // PUT - Reagendar consulta
    rescheduleAppointment: async (appointmentId, newData) => {
        const response = await api.put(`/patient/appointments/${appointmentId}`, newData);
        return response.data;
    },

    // PATCH - Atualizar status do agendamento
    updateAppointmentStatus: async (appointmentId, status) => {
        const response = await api.patch(`/api/agendamentos/${appointmentId}/status?status=${status}`);
        return response.data;
    },

    // DELETE - Cancelar agendamento
    cancelAppointment: async (appointmentId) => {
        const response = await api.delete(`/patient/appointments/${appointmentId}`);
        return response.data;
    }
};