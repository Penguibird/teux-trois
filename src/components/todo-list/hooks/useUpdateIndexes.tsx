import * as React from 'react';
import { useDragObserverContext } from '../../../contexts/dragContext';
import { useItemMoveObserverContext } from '../../../contexts/itemMoveObserverContext';
import Todo from '../../../types/Todo';
import { useTodoContext } from '../contexts/todosContext';

const useUpdateIndexes = (updateTodo: (id: Todo["id"]) => (todo: Partial<Todo>) => void, droppableID: string) => {
    const { todos: items } = useTodoContext();

    const updateTodoListIndexes = React.useCallback(() => {
        items.forEach((todo, i) => {
            if (todo.index === i) return;
            console.log("Updating indices", { todo })
            todo.index = i;
            updateTodo(todo.id)({ index: i });
        })
    }, [items, updateTodo])

    const { subscribe } = useDragObserverContext()
    React.useEffect(() => {
        const unsubscribe = subscribe((e) => {
            console.log(e)
            if (e.destination?.droppableId === droppableID || e.source.droppableId === droppableID) {
                updateTodoListIndexes();
            }
        }, droppableID)
        return unsubscribe
    }, [droppableID, subscribe, updateTodoListIndexes])
    
    const {subscribe: subscribe2} = useItemMoveObserverContext();
    React.useEffect(() => {
        const unsubscribe = subscribe2((e) => {
            console.log(e)
            if (e.result.destination?.droppableId === droppableID || e.result.source.droppableId === droppableID) {
                updateTodoListIndexes();
            }
        }, droppableID)
        return unsubscribe
    }, [droppableID, subscribe2, updateTodoListIndexes])
}

export default useUpdateIndexes