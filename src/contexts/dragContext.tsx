// import React, { createContext, useContext, } from 'react';
// import { DropResult } from 'react-beautiful-dnd';
import generateObserverContext from './genericKeyObserverContext';
import { DropResult } from 'react-beautiful-dnd';


type MyDragEvent = DropResult;


export const {
    ObserverContext: DragObserverContext,
    useObserverContext: useDragObserverContext,
    ObserverContextProvider: DragObserverContextProvider
} = generateObserverContext<MyDragEvent>()