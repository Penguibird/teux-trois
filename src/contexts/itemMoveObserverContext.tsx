import React, { createContext, useContext, } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import Todo from './../types/Todo';

type MyEvent = Todo;
type listener = (e: MyEvent, result: DropResult) => void

interface observer {
    subscribe: (listener: listener, id: string) => () => void
    publish: (e: MyEvent, result: DropResult) => void
}

const ItemMoveObserverContext = createContext<observer | null>(null);

const itemMoveObserver: () => observer = () => {
    let listeners: {
        [key: string]: listener
    } = {};

    const subscribe = (listener: listener, id: string) => {
        listeners[id] = listener;
        return () => {
            delete listeners[id];

        }
    }

    const publish = (e: MyEvent, result: DropResult) => {
        if (!result.destination) return;
        listeners[result.destination?.droppableId](e, result)
    }
    return { subscribe, publish }
}

const ItemMoveObserverContextProvider: React.FC<{ children: any }> = ({ children }) => {
    return <ItemMoveObserverContext.Provider value={itemMoveObserver()}>
        {children}
    </ItemMoveObserverContext.Provider>
}

const useItemMoveObserverContext = () => {
    const context = useContext(ItemMoveObserverContext)
    if (!context) {
        throw new Error(
            `Cannot be used outside the ItemMoveContext provider`,
        )
    }
    return context
}

export { ItemMoveObserverContext, useItemMoveObserverContext, ItemMoveObserverContextProvider }