import { useTodoContext } from "./context";
import * as React from 'react';
import Todo from '../../types/Todo';
import { v4 as uuid } from 'uuid';

interface useTodoListCallbacksProps {
    updateTodo: (id: string) => (updateTodoValues: Partial<Todo>) => Promise<void>;
    createTodo: (newTodo: Todo) => Promise<any>;
    removeTodo: (id: string) => Promise<any>;
}

const useTodoListCallbacks = ({ updateTodo, createTodo, removeTodo }: useTodoListCallbacksProps) => {
    // console.log("Rendering useTodoListCallbacks")
    const { todos, setTodos } = useTodoContext();


    const toggleTodoDone = React.useCallback((i: number) => {
        const newDoneValue = !todos[i].done;
        todos[i].done = newDoneValue;
        updateTodo(todos[i].id)({ done: newDoneValue });
        setTodos([...todos]);
    }, [setTodos, todos, updateTodo])

    const remove = React.useCallback((i: number) => {
        removeTodo(todos[i].id);
        todos.splice(i, 1);
        setTodos([...todos]);
    }, [removeTodo, setTodos, todos])

    const updateTodoText = React.useCallback((i: number, text: string) => {
        todos[i].text = text;
        updateTodo(todos[i].id)({ text });
        setTodos([...todos])
    }, [setTodos, todos, updateTodo])

    const addNewItem = React.useCallback((text: string) => {
        const t: Todo = {
            text,
            id: uuid(),
            done: false,
            index: todos.length,
        }
        createTodo(t);
        setTodos([...(todos || []), t])

    }, [createTodo, todos, setTodos])

    return { toggleTodoDone, remove, updateTodoText, addNewItem };
}

export default useTodoListCallbacks;