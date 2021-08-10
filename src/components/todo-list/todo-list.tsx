import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import styled from '@emotion/styled';
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";


import TodoItem from './../todo-item/todo-item';
import Header from './header/header';

import { colors } from '../../style/themes/colors.js'
import Todo from '../../types/Todo'
import useItemDragging from './useItemDragging/useItemDragging';


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
    todos: Todo[]
    datetime: string
    title: string
    id: string
};





// Fetches no data just displays the thing
const TodoList: React.FC<TodoListProps> = ({ children, datetime, todos, title, id, ...props }) => {
    const droppableID = `droppable-${id}`;


    const [items, setItems] = React.useState<Todo[]>(todos);
    useItemDragging({ items, setItems, droppableID })

    
    const toggleTodoDone = (i: number) => () => {
        items[i].done = !items[i].done;
        setItems([...items]);
    }
    const remove = (i: number) => () => {
        items.splice(i, 1);
        setItems([...items]);
    }
    const updateTodoText = (i: number) => (text: string) => {
        items[i].text = text;
        setItems([...items])
    }

    return <List className="todo__list-wrapper" {...props}>
        <Header>{title}</Header>
        <Date className="todo__list-date">{datetime}</Date>
        <Droppable droppableId={droppableID} type="TODOLIST">
            {(provided, snapshot) => (
                <InnerList className="todo__list-inner"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                >
                    {items?.map((todo: Todo, i) =>
                        <TodoItem remove={remove(i)} updateTodoText={updateTodoText(i)} toggleDone={toggleTodoDone(i)} todo={todo} key={todo.id} index={i} />
                    )}
                    {provided.placeholder}
                </InnerList>
            )}
        </Droppable>
    </List>

}

export default TodoList;
export type { TodoListProps };
