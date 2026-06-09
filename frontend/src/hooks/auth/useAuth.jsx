/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../../api/axiosConfig';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";

// Use null to allow the guard in useAuth to work properly
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('authToken')
        if (token) {
            try {
                const dadosDoUsuario = jwtDecode(token);
                setUser(dadosDoUsuario)
            } catch (error) {
                console.error("Falha no login", error);
                Cookies.remove('authToken')
                setUser(null)
            }
        }

        setLoading(false)
    }, [])

    const login = async ({ email, password, mfaCode = null }) => {
        try {
            const dadosParaApi = {
                email: email,
                senha: password
            };

            // Adiciona o código MFA se fornecido
            if (mfaCode && mfaCode.trim() !== '') {
                dadosParaApi.mfaCode = mfaCode;
            }

            const response = await api.post("/auth/login", dadosParaApi)
            const data = response.data
            const token = data.accessToken // Mudança: agora é accessToken

            Cookies.set('authToken', token)

            const dadosDoUsuario = jwtDecode(token);
            console.log("[AUTH-Login] Dados do usuário: ", dadosDoUsuario)
            setUser(dadosDoUsuario)
            navigate('/buscar-medico');
        } catch (error) {
            console.error("Erro no login:", error)
            throw error;
        }
    }

    const logout = () => {
        Cookies.remove('authToken')
        setUser(null)
        navigate('/login');
    }

    const requestPasswordReset = async (email) => {
        try {
            const response = await api.post('/auth/reset-password-request', { email });
            // Você pode customizar a resposta ou apenas retornar true
            return { success: true, message: response.data.message || "Link de redefinição enviado." };
        } catch (error) {
            console.error("Erro na solicitação de redefinição:", error);
            // Lançar erro para a tela tratar
            throw error; 
        }
    };
    const submitNewPassword = async (token, newPassword, confirmPassword) => {
        try {
            const response = await api.post('/auth/reset-senha', { token, newPassword, confirmPassword });
            // Retorna sucesso
            return { success: true, message: response.data.message || "Senha redefinida com sucesso." };
        } catch (error) {
            console.error("Erro ao redefinir senha:", error);
            // Lançar erro para a tela tratar
            throw error;
        }
    };

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                loading, 
                login, 
                logout,
                requestPasswordReset,
                submitNewPassword,
            }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }

    return context;
}