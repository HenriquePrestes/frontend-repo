import api from '../api/axiosConfig';

export const especialidadeService = {
    // GET - Buscar todas as especialidades
    getAllEspecialidades: async () => {
        try {
            console.log("Fazendo requisição para /api/especialidades");
            const response = await api.get('/api/especialidades');
            console.log("Resposta especialidades:", response);
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar especialidades:", error);
            throw error;
        }
    },

    // GET - Buscar especialidade por ID
    getEspecialidadeById: async (id) => {
        try {
            console.log(`Fazendo requisição para /api/especialidades/${id}`);
            const response = await api.get(`/api/especialidades/${id}`);
            console.log("Resposta especialidade por ID:", response);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar especialidade ${id}:`, error);
            throw error;
        }
    },

    // POST - Criar nova especialidade
    createEspecialidade: async (especialidade) => {
        try {
            console.log("Criando especialidade:", especialidade);
            const response = await api.post('/api/especialidades', especialidade);
            console.log("Especialidade criada:", response);
            return response.data;
        } catch (error) {
            console.error("Erro ao criar especialidade:", error);
            throw error;
        }
    },

    // PUT - Atualizar especialidade
    updateEspecialidade: async (id, especialidade) => {
        try {
            console.log(`Atualizando especialidade ${id}:`, especialidade);
            const response = await api.put(`/api/especialidades/${id}`, especialidade);
            console.log("Especialidade atualizada:", response);
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar especialidade ${id}:`, error);
            throw error;
        }
    },

    // DELETE - Remover especialidade
    deleteEspecialidade: async (id) => {
        try {
            console.log(`Removendo especialidade ${id}`);
            const response = await api.delete(`/api/especialidades/${id}`);
            console.log("Especialidade removida:", response);
            return response.data;
        } catch (error) {
            console.error(`Erro ao remover especialidade ${id}:`, error);
            throw error;
        }
    }
};

export default especialidadeService;