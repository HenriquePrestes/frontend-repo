import api from '../api/axiosConfig';

export const patientService = {
    // ==========================================
    // PERFIL DO PACIENTE
    // ==========================================

    // GET - Buscar dados do perfil (se você tiver um GET /usuarios/perfil)
    getProfile: async () => {
        const response = await api.get('/usuarios/perfil');
        return response.data;
    },

    // PUT - Atualizar perfil completo
    updateProfile: async (profileData) => {
        const response = await api.put('/usuarios/perfil', profileData);
        return response.data;
    },

    // PATCH - Atualizar campos específicos do perfil
    updatePartialProfile: async (partialData) => {
        const response = await api.patch('/usuarios/perfil', partialData);
        return response.data;
    },

    // ==========================================
    // OUTRAS OPERAÇÕES (para o futuro)
    // ==========================================

    // GET - Buscar histórico médico
    getMedicalHistory: async () => {
        const response = await api.get('/usuarios/medical-history');
        return response.data;
    },

    // POST - Adicionar informação médica
    addMedicalInfo: async (medicalData) => {
        const response = await api.post('/usuarios/medical-history', medicalData);
        return response.data;
    }
};