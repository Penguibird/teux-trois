import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import styled from '@emotion/styled';
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
// import { v4 as uuid } from 'uuid'

import TodoItem from './components/todo-item/todo-item';
import Header from './components/header/header';
import Input from './components/todo-item-input/todo-item-input'

import { colors } from '../../style/themes/colors.js'
import Todo from '../../types/Todo'
import useItemDragging from './hooks/useItemDragging';

import { MONTHNAMES } from '../../utils/dateHelpers'
import firebaseInstance from './../../services/firebase/firebase';
import { useUserContext } from '../../contexts/userContext';

import { StyledInput } from './components/todo-item-input/todo-item-input';
import AddTodoItem from './components/add-todo-item/add-todo-item';
import useTodos from './hooks/useTodos';
import { useDragObserverContext } from '../../contexts/dragContext';
import { useItemMoveObserverContext } from '../../contexts/itemMoveObserverContext';
import useUpdateIndexes from './hooks/useUpdateIndexes';
import { TodoContextProvider, useTodoContext } from './contexts/todosContext';
import useUpdateDbOnItemAdded from './hooks/useUpdateDbOnItemAdded';
import useUpdateDbOnItemRemoved from './hooks/useUpdateDbOnItemRemoved';


const List = styled.div({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
})

const Date = styled.p({
    textTransform: 'uppercase',
    fontSize: '.6111111111rem',
    marginTop: '.2777777778rem'
})

const InnerList = styled.ul({
    marginTop: '2em',
    width: '100%',
    backgroundImage: `repeating-linear-gradient(
        transparent,
        transparent 22px,
        ${colors.borderGray} 22px,
        ${colors.borderGray} 23.23px,
        transparent 23.23px,
        transparent 25px);`,
})



const getListStyle = (isDraggingOver: boolean) => ({
    // background: isDraggingOver ? "lightblue" : "lightgrey",

});



interface TodoListProps {
    children?: React.ReactChildren
    todos?: Todo[]
    datetime?: string | Date
    title: string
    id: string
};





// Fetches no data just displays the thing
const UnwrappedTodoList: React.FC<TodoListProps> = ({ children, datetime, todos: initialTodos = [], title, id, ...props }) => {
    const droppableID = `droppable-${id}`;


    console.log("Rerendering todo list", droppableID)

    const { todos, setTodos } = useTodoContext();

    //Fetches todos
    const { updateTodo, createTodo, removeTodo } = useTodos(id);

    // Takes care of any item dragging/dropping logic
    useItemDragging(droppableID)

    // Updates the items order after dragging
    useUpdateIndexes(updateTodo, droppableID)



    // Subscribes to drag actions and updates the db accordingly
    useUpdateDbOnItemAdded(droppableID, createTodo);
    useUpdateDbOnItemRemoved(droppableID, removeTodo);


    const toggleTodoDone = (i: number) => () => {
        const newDoneValue = !todos[i].done;
        todos[i].done = newDoneValue;
        updateTodo(todos[i].id)({ done: newDoneValue });
        setTodos([...todos]);
    }

    const remove = (i: number) => () => {
        todos.splice(i, 1);
        removeTodo(todos[i].id);
        setTodos([...todos]);
    }

    const updateTodoText = (i: number) => (text: string) => {
        todos[i].text = text;
        updateTodo(todos[i].id)({ text });
        setTodos([...todos])
    }

    const addNewItem = React.useCallback((t: Todo) => {
        t.index = todos.length;
        createTodo(t);
        setTodos([...(todos || []), t])

    }, [createTodo, todos, setTodos])

    datetime = typeof datetime !== 'string'
        ? `${MONTHNAMES[datetime?.getMonth() ?? 0]} ${datetime?.getDate()}, ${datetime?.getFullYear()}`
        : datetime;

    return <List className="todo__list-wrapper" {...props}>
        <Header>{title}</Header>
        {datetime && <Date className="todo__list-date">{datetime}</Date>}
        <Droppable droppableId={droppableID} type="TODOLIST">
            {(provided, snapshot) => (
                <InnerList className="todo__list-inner"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                >
                    {todos?.map((todo: Todo, i) =>
                        <TodoItem remove={remove(i)} updateTodoText={updateTodoText(i)} toggleDone={toggleTodoDone(i)} todo={todo} key={todo.id} index={i} />
                    )}
                    {provided.placeholder}
                    <AddTodoItem addNewItem={addNewItem} />
                </InnerList>
            )}
        </Droppable>
    </List>

}

const TodoList: React.FC<TodoListProps> = (props) => <TodoContextProvider>
    <UnwrappedTodoList {...props} />
</TodoContextProvider>

export default TodoList;
export type { TodoListProps };
