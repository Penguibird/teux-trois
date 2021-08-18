import { useItemMoveObserverContext } from "../contexts/itemMoveObserverContext";
import * as React from 'react';
import Todo from '../types/Todo';

const useUpdateDbOnItemAdded = (droppableID: string, createTodo: (t: Todo) => unknown) => {
    const { subscribe: addEventListenerOnItemAdded } = useItemMoveObserverContext();
    React.useEffect(() => {
        return addEventListenerOnItemAdded((e) => {
            const todo = e.todo;
            if (!e.result.destination) return;
            todo.index = e.result.destination.index;
            createTodo(todo);
        }, droppableID)
    }, [addEventListenerOnItemAdded, createTodo, droppableID])
}
export default useUpdateDbOnItemAdded;