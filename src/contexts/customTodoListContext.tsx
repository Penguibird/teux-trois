import React, { useContext, useState, createContext, useMemo, } from 'react';
import { TodoList } from '../types/TodoList';


interface todoListsStateType {
    todoLists: TodoList[] | null;
    setTodoLists: React.Dispatch<React.SetStateAction<TodoList[]>> | null;
}

const TodoListsContext = createContext<todoListsStateType>({
    todoLists: null,
    setTodoLists: null,
});

const useTodoListsContext = () => {
    const context = useContext(TodoListsContext)
    if (!context) {
        throw new Error(
            `Cannot be used outside the TodoLists context`,
        )
    }
    const { todoLists, setTodoLists: setTodosUnsafe } = context;

    const setTodoLists = React.useCallback((_: React.SetStateAction<TodoList[]>) => {
        if (setTodosUnsafe) setTodosUnsafe(_);
    }, [setTodosUnsafe])

    return { todoLists, setTodoLists }

}

const TodoListsContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [todoLists, setTodoLists] = useState<TodoList[]>([]);

    const value = useMemo(() => ({ todoLists, setTodoLists }), [todoLists]);

    return <TodoListsContext.Provider value={value}>
        {children}
    </ TodoListsContext.Provider>
}

export { TodoListsContext, useTodoListsContext, TodoListsContextProvider }