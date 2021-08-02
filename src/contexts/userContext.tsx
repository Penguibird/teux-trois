import React, { useContext, useState, createContext, useMemo, } from 'react';
import firebase from 'firebase'


interface userStateType {
    user: firebase.User | null;
    setUser: React.Dispatch<React.SetStateAction<firebase.User | null>> | null;
}

const UserContext = createContext<userStateType>({
    user: null,
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

    const [user, setUser] = useState<firebase.User | null>(null);

    const value = useMemo(() => ({ user, setUser }), [user]);

    return <UserContext.Provider value={value}>
        {children}
    </ UserContext.Provider>
}

export { UserContext, useUserContext, UserContextProvider }