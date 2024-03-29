import React, { createContext, useContext, } from 'react';

type MyEvent<T> = T;
type listener<T> = (e: MyEvent<T>) => void

interface observer<T> {
    subscribe: (listener: listener<T>, id: string) => () => void
    publish: (e: MyEvent<T>, targetID: string) => void
}

function generateObserverContext<T>() {
    const ObserverContext = createContext<observer<T> | null>(null);

    const genericObserver: () => observer<T> = () => {
        let listeners: {
            [key: string]: (listener<T> | null)[]
        } = {};

        const subscribe = (listener: listener<T>, id: string) => {
            if (!listeners[id])
                listeners[id] = [];
            const index = listeners[id].length;
            listeners[id].push(listener);
            return () => {
                listeners[id][index] = null;
            }
        }

        const publish = (e: MyEvent<T>, targetID: string) => {
            // if (!result.destination) return;
            // console.log({ e, targetID, listeners, }, listeners[targetID])
            listeners[targetID]?.forEach(f => f?.(e))
        }
        return { subscribe, publish }
    }

    const ObserverContextProvider: React.FC<{ children: any }> = ({ children }) => {
        return <ObserverContext.Provider value={genericObserver()}>
            {children}
        </ObserverContext.Provider>
    }

    const useObserverContext = () => {
        const context = useContext(ObserverContext)
        if (!context) {
            throw new Error(
                `Cannot be used outside the ItemMoveContext provider`,
            )
        }
        return context
    }

    return { ObserverContext, useObserverContext, ObserverContextProvider }
}

export default generateObserverContext