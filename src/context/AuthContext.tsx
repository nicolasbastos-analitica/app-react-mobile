// src/contexts/AuthContext.tsx

import React, { createContext, ReactNode, useContext, useState } from 'react';

// 1. Define o formato (Shape) do Contexto
interface AuthContextType {
    // Armazena o login (número de registro) ou null
    userLogin: string | null;
  
    
    // Função para fazer login e salvar o número de registro
    setLogin: (login: string) => void;
    
    // Função para fazer logout e limpar o login
    signOut: () => void;
}

// 2. Cria o Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Cria o Provedor (Provider)
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [userLogin, setUserLogin] = useState<string | null>(null);

    const setLogin = (login: string) => {
        setUserLogin(login);
    };

    const signOut = () => {
        setUserLogin(null);
    };

    return (
        <AuthContext.Provider value={{ userLogin, setLogin, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Hook Customizado
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};