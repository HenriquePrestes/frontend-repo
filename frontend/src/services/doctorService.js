import api from '../api/axiosConfig';

export const doctorService = {
    // GET - Buscar todos os médicos
    getDoctors: async (filters = {}) => {
        try {
            // Tenta primeiro com parâmetros de paginação explícitos
            const params = {
                ...filters,
                page: 0,
                size: 50, // Busca até 50 médicos
                sort: 'id,asc'
            };
            console.log("Fazendo requisição com parâmetros:", params);
            const response = await api.get('/api/medicos', { params });
            console.log("Resposta recebida:", response);
            return response.data;
        } catch (error) {
            console.error("Erro na requisição getDoctors:", error);
            throw error;
        }
    },

    // GET - Buscar todos os médicos sem paginação
    getAllDoctors: async () => {
        try {
            console.log("Fazendo requisição para /api/medicos/all");
            const response = await api.get('/api/medicos/all');
            console.log("Resposta /all:", response);
            return response.data;
        } catch (error) {
            console.error("Erro na requisição getAllDoctors:", error);
            throw error;
        }
    },

    // GET - Buscar médico por ID
    getDoctorById: async (doctorId) => {
        const response = await api.get(`/api/medicos/${doctorId}`);
        return response.data;
    },

    // GET - Buscar horários de um médico específico
    getDoctorSchedule: async (doctorId) => {
        const response = await api.get(`/api/medicos/${doctorId}/horarios`);
        return response.data;
    },

    // POST - Criar novo médico
    createDoctor: async (doctorData) => {
        const response = await api.post('/api/medicos', doctorData);
        return response.data;
    },

    // PUT - Atualizar médico
    updateDoctor: async (doctorId, doctorData) => {
        const response = await api.put(`/api/medicos/${doctorId}`, doctorData);
        return response.data;
    },

    // DELETE - Remover médico
    deleteDoctor: async (doctorId) => {
        const response = await api.delete(`/api/medicos/${doctorId}`);
        return response.data;
    },

    // GET - Buscar especialidades disponíveis
    getSpecialties: async () => {
        const response = await api.get('/doctors/specialties');
        return response.data;
    },

    // GET - Buscar horários disponíveis do médico
    getAvailableSlots: async (doctorId, date) => {
        const response = await api.get(`/doctors/${doctorId}/available-slots`, {
            params: { date }
        });
        return response.data;
    },

    // GET - Buscar médicos por especialidade
    getDoctorsBySpecialty: async (specialtyId) => {
        const response = await api.get(`/doctors/specialty/${specialtyId}`);
        return response.data;
    }
};