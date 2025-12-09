import userData from '@/src/cache/users.json'; // Ajuste o caminho do seu JSON
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useAuth } from './AuthContext'; // Ajuste o caminho conforme seu projeto
import { UserData, UserDataFile } from './user.types';

interface UserContextData {
    loggedInUserData: UserData | null;
    displayUserName: string;
    displayUserLogin: string;
    equipmentNumber: string;
    companyUnityId: number | null;
    companyUnityCode: number | null;
    setEquipmentNumber: (value: string) => void;
    allUsers: UserData[];
    getUserByLogin: (login: string) => UserData | undefined;
}

const UserContext = createContext<UserContextData>({} as UserContextData);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const { userLogin } = useAuth();
    const [equipmentNumber, setEquipmentNumber] = useState<string>('');

    const fallbackUser = 'Usuário';
    const fallbacknumRegistro = '000000';

    // Carrega todos os usuários do JSON
    const allUsers = (userData as UserDataFile).data;

    // Busca o usuário logado
    const loggedInUserData = userLogin
        ? allUsers.find((user) => user.login === userLogin) || null
        : null;

    const displayUserName = loggedInUserData?.name || fallbackUser;
    const displayUserLogin = userLogin || fallbacknumRegistro;

    // Função auxiliar para buscar usuário por login
    const getUserByLogin = (login: string): UserData | undefined => {
        return allUsers.find((user) => user.login === login);
    };

    return (
        <UserContext.Provider
            value={{
                loggedInUserData,
                displayUserName,
                displayUserLogin,
                equipmentNumber,
                companyUnityId: loggedInUserData?.company_unit_id || null,
                companyUnityCode: loggedInUserData?.company_unit_code || null,
                setEquipmentNumber,
                allUsers,
                getUserByLogin,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextData => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('useUser deve ser usado dentro de um UserProvider');
    }

    return context;
};