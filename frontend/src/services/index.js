export { patientService } from './patientService';
export { doctorService } from './doctorService';
export { appointmentService } from './appointmentService';
export { especialidadeService } from './especialidadeService';

export const handleApiError = (error) => {
    if (error.response?.data?.message) {
        return error.response.data.message;
    }

    switch (error.response?.status) {
        case 400:
            return 'Dados inválidos. Verifique as informações.';
        case 401:
            return 'Sessão expirada. Faça login novamente.';
        case 403:
            return 'Você não tem permissão para esta ação.';
        case 404:
            return 'Recurso não encontrado.';
        case 500:
            return 'Erro interno do servidor. Tente novamente.';
        default:
            return 'Erro inesperado. Tente novamente.';
    }
};