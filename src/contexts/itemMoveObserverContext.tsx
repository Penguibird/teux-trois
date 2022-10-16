// import React from 'react';

import generateObserverContext from './genericKeyObserverContext';

import { DropResult } from 'react-beautiful-dnd';
import Todo from '../types/Todo';
import { DocumentReference } from 'firebase/firestore';


interface ItemMoveEvent {
    todo: Todo;
    docRef: DocumentReference<unknown>
    result: DropResult
}
export const {
    ObserverContext: ItemMoveObserverContext,
    useObserverContext: useItemMoveObserverContext,
    ObserverContextProvider: ItemMoveObserverContextProvider
} = generateObserverContext<ItemMoveEvent>()