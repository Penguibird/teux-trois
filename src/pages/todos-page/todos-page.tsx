import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import WeekView from './../../components/week-view/week-view';
import { DragDropContext } from 'react-beautiful-dnd';
import { DragObserverContextProvider, useDragObserverContext } from '../../contexts/dragContext';
import { ItemMoveObserverContextProvider } from '../../contexts/itemMoveObserverContext';
import CustomListsView from './../../components/custom-lists-view/custom-lists-view';

interface TodosPageProps {

};

const UnwrappedTodosPage: React.FC<TodosPageProps> = ({ }) => {

    const { publish } = useDragObserverContext();

    return <main>
        <DragDropContext onDragEnd={(result) => publish(result, result.source.droppableId)}>

            <WeekView />
            <CustomListsView />
        </DragDropContext>
    </main>
}

const TodosPage = (props: TodosPageProps) => {
    return <ItemMoveObserverContextProvider>
        <DragObserverContextProvider>
            <UnwrappedTodosPage {...props} />
        </DragObserverContextProvider>
    </ItemMoveObserverContextProvider>
}

export default TodosPage;
