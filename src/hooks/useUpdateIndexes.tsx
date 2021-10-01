import * as React from 'react';
import { useDragObserverContext } from '../contexts/dragContext';
import { useItemMoveObserverContext } from '../contexts/itemMoveObserverContext';
import Todo from '../types/Todo';
import { useTodoContext } from '../components/todo-list/context';

const useUpdateIndexes = (updateTodo: (id: Todo["id"]) => (todo: Partial<Todo>) => void, droppableID: string) => {
   
}

export default useUpdateIndexes