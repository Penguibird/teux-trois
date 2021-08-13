import React, { useContext, useState, createContext, useMemo, } from 'react';
import Todo from './../../../types/Todo';


interface todoStateType {
    todos: Todo[];
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>> | null;
}

const TodosContext = createContext<todoStateType>({
    todos: [],
    setTodos: null,
});

const useTodoContext = () => {
    const context = useContext(TodosContext)
    if (!context) {
        throw new Error(
            `Cannot be used outside the app`,
        )
    }
    const { todos, setTodos: setTodosUnsafe } = context;

    const setTodos = React.useCallback((_) => {
        if (setTodosUnsafe) setTodosUnsafe(_);
    }, [setTodosUnsafe])

    return { todos, setTodos };

}


const TodoContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [todos, setTodos] = useState<todoStateType["todos"]>([]);

    const value = useMemo(() => ({ todos, setTodos }), [todos]);

    return <TodosContext.Provider value={value}>
        {children}
    </ TodosContext.Provider>
}

export { TodosContext, useTodoContext, TodoContextProvider }