import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        //tenta carregar o tema salvo no localStorage
        const saved = localStorage.getItem("theme");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (error) {
                // Se não for JSON válido, remove o valor inválido e usa o padrão
                console.warn("Valor inválido no localStorage para 'theme', usando padrão:", saved);
                localStorage.removeItem("theme");
            }
        }

        return {
            clinicName: "",
            primaryColor: "#3B7868",
            secondaryColor: "#2C5A4D",
            logo: null,
        };
    });

    //aplica as cores iniciais no carregamento e sempre que mudarem
     useEffect(() => {
        document.documentElement.style.setProperty("--primary-color", theme.primaryColor);
        document.documentElement.style.setProperty("--secondary-color", theme.secondaryColor);
     }, [theme.primaryColor, theme.secondaryColor]);

    //salva no localStorage sempre que o tema mudar
    useEffect(() => {
        localStorage.setItem("theme", JSON.stringify(theme));
    }, [theme]);

    //função para atualizar o tema
    const updateTheme = (updates) => {
        setTheme((prev) => ({ ...prev, ...updates }));

        if (updates.primaryColor) {
        document.documentElement.style.setProperty("--primary-color", updates.primaryColor);
    }
        if (updates.secondaryColor) {
        document.documentElement.style.setProperty("--secondary-color", updates.secondaryColor);
    }
    };

    //restaura as cores no padrão original (antes das mudanças do usuário)
    const defaultTheme = {
    clinicName: "",
    primaryColor: "#3B7868",
    secondaryColor: "#2C5A4D",
    logo: null,
    };

    const resetTheme = () => {
    setTheme(defaultTheme);
    localStorage.setItem("theme", JSON.stringify(defaultTheme));

    document.documentElement.style.setProperty("--primary-color", defaultTheme.primaryColor);
    document.documentElement.style.setProperty("--secondary-color", defaultTheme.secondaryColor);
    };

    return (
        <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}