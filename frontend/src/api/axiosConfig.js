import axios from "axios";
import Cookies from "js-cookie";

// 1. Cria uma instância do Axios com configurações pré-definidas
const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true, // Habilita o envio automático de cookies
});

api.interceptors.request.use(
    (config) => {
        /// 1. Pegamos o token de onde ele foi salvo (ex: localStorage)
        const token = Cookies.get("authToken");

        // 2. Se o token existir, nós o adicionamos aos cabeçalhos
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }

        // 3. Retornamos a config (modificada ou não)
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. (Opcional, mas muito recomendado) Adiciona um interceptor de resposta
// Isso permite tratar erros de forma global.
api.interceptors.response.use(
    (response) => response, // Se a resposta for sucesso, apenas a retorna
    (error) => {
        const isLoginRoute = window.location.pathname === '/login';

        // Se o erro for 401 (Não Autorizado) ou 403 (Proibido)
        if (error.response && [401, 403].includes(error.response.status) && !isLoginRoute) {
            // Remove o token expirado/inválido
            Cookies.remove('authToken');
            
            // Redireciona para o login
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

// 3. Exporta a instância configurada
export default api;
