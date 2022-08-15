import React, { useState } from 'react'
import { UserPreferences } from '../types/UserPreferences';

const defaultPreferences: UserPreferences = {
    weekListBehavior: 'startAtYesterday'
}

const UserPreferencesContext = React.createContext<{
    userPreferences: UserPreferences;
    setUserPreferences: React.Dispatch<React.SetStateAction<UserPreferences>> | null
}>({
    userPreferences: defaultPreferences,
    setUserPreferences: null
});



const UserPreferencesProvider = ({ children }: { children: React.ReactNode }) => {

    const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultPreferences);
    const value = React.useMemo(() => ({ userPreferences, setUserPreferences }), [userPreferences]);

    return <UserPreferencesContext.Provider value={value}>
        {children}
    </UserPreferencesContext.Provider>
}

const useUserPreferences = () => {
    const context = React.useContext(UserPreferencesContext)
    if (!context) {
        throw new Error(
            `Cannot be used outside the app`,
        )
    }
    return context
}

export { UserPreferencesProvider, useUserPreferences };