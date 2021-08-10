import * as React from 'react'
import { useDragObserverContext } from '../../../contexts/dragContext';
import { useItemMoveObserverContext } from '../../../contexts/itemMoveObserverContext';
import Todo from './../../../types/Todo';

interface useItemDraggingProps {
    items: Todo[],
    setItems: React.Dispatch<React.SetStateAction<Todo[]>>,
    droppableID: string,

}

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Handles all the item dragging and dropping logic
 * @param items the items state
 * @param setItems the items state
 * 
 */
const useItemDragging = ({ items, setItems, droppableID }: useItemDraggingProps) => {
    const { subscribe: onDragEnd } = useDragObserverContext();
    const { subscribe: onItemMoved, publish: publishItemMove } = useItemMoveObserverContext();

    // Handles the listener to the end of drag effect and appropriately removes the item
    // Publishes the item moved event
    React.useEffect(() => {
        const unsubscribe = onDragEnd((result) => {
            if (!result.destination) {
                return;
            }

            if (result.source.droppableId === droppableID) {
                const removedItem = items.splice(result.source.index, 1)[0];
                publishItemMove({ todo: removedItem, result }, result.destination.droppableId);
                setItems([...items])
            }

        }, droppableID)
        return unsubscribe;
    }, [droppableID, items, onDragEnd, publishItemMove, setItems])




    // Listens to the item moved event and adds it if appropriate
    React.useEffect(() => {
        const unsubscribe = onItemMoved(({ todo: item, result }) => {
            if (!result.destination) return;
            items.splice(result.destination?.index, 0, item);
            setItems([...items])
        }, droppableID)
        return unsubscribe;
    }, [droppableID, items, onItemMoved, setItems]) 
}

export default useItemDragging;