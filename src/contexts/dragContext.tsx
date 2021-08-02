import React, { createContext, useContext, } from 'react';
import { DropResult } from 'react-beautiful-dnd';

type MyEvent = DropResult;
type listener = (e: MyEvent) => void

interface observer {
    subscribe: (listener: listener) => () => void
    publish: (e: MyEvent) => void
}

const DragObserverContext = createContext<observer | null>(null);

const dragObserver: () => observer = () => {
    let listeners: listener[] = [];

    const subscribe = (listener: listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);

        }
    }

    const publish = (e: MyEvent) => {
        listeners.forEach(listener => {
            listener(e);
        })
    }
    return { subscribe, publish }
}

const DragObserverContextProvider: React.FC<{ children: any }> = ({ children }) => {
    return <DragObserverContext.Provider value={dragObserver()}>
        {children}
    </DragObserverContext.Provider>
}

const useDragObserverContext = () => {
    const context = useContext(DragObserverContext)
    if (!context) {
        throw new Error(
            `Cannot be used outside the DragContext provider`,
        )
    }
    return context
}

export { DragObserverContext, useDragObserverContext, DragObserverContextProvider }