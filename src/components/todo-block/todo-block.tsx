import * as React from 'react';
import TodoList from '../todo-list/todo-list';
//import {Fragment, useState, useEffect} from 'react';
import Todo from './../../types/Todo';
import { DragDropContext } from 'react-beautiful-dnd';
import { DragObserverContextProvider, useDragObserverContext } from '../../contexts/dragContext'
import { ItemMoveObserverContextProvider } from '../../contexts/itemMoveObserverContext';
interface TodoBlockProps {

};

// Fetches the data and puts it in a List
// Contains no styling
const UnwrappedTodoBlock: React.FC<TodoBlockProps> = ({ }) => {
    const todos1: Todo[] = [
        {
            id: '1',
            text: 'Sit ullamco laborum commodo veniam labore commodo anim fugiat in.',
            done: false,
        },
        {
            id: '2',
            text: 'Est sint in dolore excepteur voluptate.',
            done: false,
        },
        {
            id: '3',
            text: 'Sit  commodo anim fugiat in.',
            done: false,
        },
        {
            id: '4',
            text: 'Aute sint occaecat duis in voluptate sunt sint duis sint.',
            done: false,
        }
    ]
    const todos2: Todo[] = [
        {
            id: '12',
            text: 'Deserunt consectetur eiusmod pariatur cupidatat nulla non.',
            done: true,
        },
        {
            id: '14',
            text: 'Velit mollit deserunt ullamco irure do labore laborum consequat nisi.',
            done: false,
        },
        {
            id: '15',
            text: 'Ex occaecat occaecat commodo veniam in ea consequat.',
            done: false,
        },
    ]
    const { publish } = useDragObserverContext();

    return <DragDropContext onDragEnd={(result) => publish(result, result.source.droppableId)}>
        <TodoList id="34516951" todos={todos1} title="Monday" datetime="September 2, 2021" />
        <TodoList id="5622" todos={todos2} title="Tuesday" datetime="September 3, 2021" />
    </DragDropContext>
}

const TodoBlock: React.FC<TodoBlockProps> = (props) => {
    return <ItemMoveObserverContextProvider>
        <DragObserverContextProvider>
            <UnwrappedTodoBlock {...props} />
        </DragObserverContextProvider>
    </ItemMoveObserverContextProvider>
}

export default TodoBlock;
