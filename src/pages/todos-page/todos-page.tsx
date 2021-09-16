import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import WeekView from './week-view/week-view';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { DragObserverContextProvider, useDragObserverContext } from '../../contexts/dragContext';
import { ItemMoveObserverContextProvider } from '../../contexts/itemMoveObserverContext';
import CustomListsView from './custom-lists-view/custom-lists-view';
import Layout from './../../components-style/layout';
import blurAllInputs from './../../utils/blurAllInputs';

interface TodosPageProps {

};

const UnwrappedTodosPage: React.FC<TodosPageProps> = ({ }) => {

    const { publish } = useDragObserverContext();
    const onDragEnd = (result: DropResult) => {
        if (result.type === "CUSTOMLISTS") {
            publish(result, "CUSTOMLISTS")
        } else {
            publish(result, result.source.droppableId)
        }
    }

    return <Layout>
        <DragDropContext onDragStart={blurAllInputs} onDragEnd={onDragEnd}>

            <WeekView />
            <CustomListsView />
        </DragDropContext>
    </Layout>
}

const TodosPage = (props: TodosPageProps) => {
    return <ItemMoveObserverContextProvider>
        <DragObserverContextProvider>
            <UnwrappedTodosPage {...props} />
        </DragObserverContextProvider>
    </ItemMoveObserverContextProvider>
}

export default TodosPage;
