import * as React from 'react';
import { useDragObserverContext } from '../../../contexts/dragContext';
import Todo from './../../../types/Todo';


const useUpdateDbOnItemRemoved = (droppableID: string, removeTodo: (a: Todo['id']) => () => Promise<unknown>) => {
    const { subscribe: addEventListenerOnItemRemoved } = useDragObserverContext();
    React.useEffect(() => {
        return addEventListenerOnItemRemoved((e) => {
            removeTodo(e.draggableId)()
        }, droppableID)
    }, [addEventListenerOnItemRemoved, droppableID, removeTodo])
}

export default useUpdateDbOnItemRemoved;