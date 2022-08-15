// import React from 'react';

import generateObserverContext from './genericKeyObserverContext';

import { DropResult } from 'react-beautiful-dnd';
import Todo from '../types/Todo';


interface ItemMoveEvent {
    todo: Todo;
    result: DropResult
}
export const {
    ObserverContext: ItemMoveObserverContext,
    useObserverContext: useItemMoveObserverContext,
    ObserverContextProvider: ItemMoveObserverContextProvider
} = generateObserverContext<ItemMoveEvent>()