import * as React from 'react'
import { useDragObserverContext } from '../contexts/dragContext';
import { useItemMoveObserverContext } from '../contexts/itemMoveObserverContext';
import { useTodoContext } from '../components/todo-list/context';

/**
 * Handles all the item dragging and dropping logic
 * @param items the items state
 * @param setItems the items state
 * 
 */
const useItemDragging = (droppableID: string, removeTodo: (id: string) => void) => {
    
}

export default useItemDragging;