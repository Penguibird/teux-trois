import React, { useContext, useState, createContext, useMemo, } from 'react';
import type { User } from "firebase/auth"
import { auth } from '../services/firebase/auth';
import firebaseInstance from '../services/firebase/firebase';

interface userStateType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>> | null;
}

const userString = window.localStorage.getItem(`firebase:authUser:${firebaseInstance.options.apiKey}:[DEFAULT]`);
const defUser = auth.currentUser ?? (userString ? JSON.parse(userString) : null);

const UserContext = createContext<userStateType>({
    user: defUser,
    setUser: null,
});

const useUserContext = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error(
            `Cannot be used outside the app`,
        )
    }
    return context

}

const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [user, setUser] = useState<User | null>(defUser);

    const value = useMemo(() => ({ user, setUser }), [user]);

    return <UserContext.Provider value={value}>
        {children}
    </ UserContext.Provider>
}

export { UserContext, useUserContext, UserContextProvider }