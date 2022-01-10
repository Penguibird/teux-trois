import React, { } from 'react';
import Todo from '../types/Todo';
import { TodoList } from '../types/TodoList';
import EventBusList from '../services/EventBusList'
interface PayloadMap {
    onInitialize: () => void
    onFetchList: (t: Todo[]) => Promise<Todo[]> | void
    onUpdateList: (t: { todoListName: string, todos: Todo[] }) => Promise<TodoList> | void
    onDeleteList: () => boolean
    onAdd: (t: Todo) => Todo
}
export type EventType = keyof PayloadMap
type PayloadType<T extends EventType> = Parameters<PayloadMap[T]>[0]
type CallbackReturnType<T extends EventType> = ReturnType<PayloadMap[T]>
type Listener<T extends EventType> = ((payload: PayloadType<T>) => CallbackReturnType<T>)

export interface EventBus {
    addEventListener: <T extends EventType>(e: T, cb: (payload: PayloadType<T>) => CallbackReturnType<T>) => () => void;
    publish: <T extends EventType>(e: T, payload?: PayloadType<T>) => CallbackReturnType<T> | undefined;
}

export class EventBus implements EventBus {
    private listeners: Partial<{
        [T in keyof PayloadMap]: (Listener<T> | null)[]
    }> = {

        }
    constructor(id: string) {
        console.log("Initializing Event bus with id ", id)
        EventBusList.addEventBus(id, this);
    }
    addEventListener = <T extends EventType>(e: T, cb: (payload: PayloadType<T>) => CallbackReturnType<T>) => {
        if (!this.listeners[e])
            this.listeners[e] = [] as any[];
        if (!this.listeners[e]) throw new Error();

        const i = this.listeners[e]!.length
        this.listeners[e]!.push(cb as any);
        return () => {
            if (!this.listeners[e]) return;
            this.listeners[e]![i] = null;
        }
    }
    publish = <T extends EventType>(e: T, payload?: PayloadType<T>) => {
        if (!this.listeners[e]) return;
        const returns = this.listeners[e]!.map(cb =>
            // @ts-ignore
            payload ? cb?.(payload) : cb?.()
        ).filter(Boolean);
        if (returns.length > 1) {
            console.error("More than one event listener trying to return, where only one was expected.", e, payload);
            // return;
        }
        return returns[0] as CallbackReturnType<T>;
    }
}


export type ContextType = React.MutableRefObject<EventBus | undefined> | null;
const EventBusContext = React.createContext<ContextType>(null);

export const EventBusProvider = ({ id, children }: { id: string, children: React.ReactNode }) => {

    const bus = React.useRef<EventBus>();
    if (!bus.current)
        bus.current = new EventBus(id);
    // React.useEffect(() => {
    // }, [id])

    return <EventBusContext.Provider value={bus}>
        {children}
    </EventBusContext.Provider>
}

export const useEventBus = () => {
    const bus = React.useContext(EventBusContext);
    if (!bus) {
        throw new Error("Event Bus cannot be used outside event bus context")
    }
    if (!bus.current)
        throw new Error()
    return bus.current;
}