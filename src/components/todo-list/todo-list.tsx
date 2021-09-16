/** @jsxRuntime classic /
/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
import styled from '@emotion/styled';
import { Droppable, } from "react-beautiful-dnd";

import TodoItem, { Item } from '../todo-item/todo-item';
import Header from './listHeader/header';

import { colors, variables } from '../../style/themes/colors.js'
import Todo from '../../types/Todo'
import useItemDragging from '../../hooks/useItemDragging';

import { MONTHNAMES } from '../../utils/dateHelpers'

import AddTodoItem from '../add-todo-item/add-todo-item';
import { TodoContextProvider, useTodoContext } from './context';
import compareObjects from './../../utils/compareObjects';
import EditableHeader from './listHeader/editable-header';
import useTodoListCallbacks from './useTodoListCallbacks';
import useTodos from './useTodos';
import useUpdateIndexes from './../../hooks/useUpdateIndexes';
import useUpdateDbOnItemAdded from './../../hooks/useUpdateDbOnItemAdded';
import useUpdateDbOnItemRemoved from './../../hooks/useUpdateDbOnItemRemoved';


const List = styled.div<{ isToday?: boolean, isInThePast?: boolean }>`
    box-sizing: border-box;    
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    padding: 0em 1em;
    width: calc((100vw - (${variables.sideBarWidth}) * 2) / 5);
    * + & {
        border-left: ${colors.borderGray} ${variables.borderWidth} solid;
    }
    &:last-child {
        border-right: ${colors.borderGray} ${variables.borderWidth} solid;
    }
    ${props => props.isToday && `
        color: ${colors.primaryColor};
        ${Header}, ${DateText}, ${Item} {
            color: ${colors.primaryColor};
        }
        ${Item}:hover {
            color: ${colors.dark};
        }
    `}
    ${props => props.isInThePast && `
        color: ${colors.crossedTodoColor};
        ${Header}, ${DateText}, ${Item} {
            color: ${colors.crossedTodoColor};
        }
        ${Item}:hover {
            color: ${colors.dark};
        }
    `}
    
`

const DateText = styled.p`
    text-transform: uppercase;
    font-size: .6111111111rem;
    margin-top: .2777777778rem;
`

const InnerList = styled.ul`
    margin-top: 2em;
    width: 100%;
    flex: 1 1 auto;
    background-image: repeating-linear-gradient(
        transparent,
        transparent 22px,
        ${colors.borderGray} 22px,
        ${colors.borderGray} 23.23px,
        transparent 23.23px,
        transparent 25px);
`;



const getListStyle = (isDraggingOver: boolean) => ({
    // background: isDraggingOver ? "lightblue" : "lightgrey",
});

interface TodoListProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    children?: React.ReactNode;
    todos?: Todo[]
    datetime?: string | Date | number
    // datetimeNumber?: number
    title: string
    id: string
    isToday?: boolean
    isInThePast?: boolean
    customList?: boolean
    editable?: boolean
    headerEditingComponent?: unknown,
};



// Fetches no data just displays the thing
const UnwrappedTodoList = React.forwardRef<any, any>(({ headerEditingComponent, editable, children, customList, datetime, todos: initialTodos = [], title, id, isToday, isInThePast, ...props }: TodoListProps, ref: React.LegacyRef<HTMLDivElement>) => {
    const droppableID = `droppable-${id}`;
    console.log("Rerendering todo list", droppableID)

    const displayDate = React.useMemo(() => {
        if (!datetime)
            return;
        if (typeof datetime == 'string')
            return datetime;
        const date: Date = typeof datetime == 'number' ? (new Date(datetime)) : datetime;
        return `${MONTHNAMES[date?.getMonth() ?? 0]} ${date?.getDate()}, ${date?.getFullYear()}`;
    }, [datetime])


    const { todos } = useTodoContext();

    //Fetches todos
    const { updateTodo, createTodo, removeTodo } = useTodos(id, customList ? 'customTodos' : 'todos');

    // Creates all the callbacks for the TodoItem
    const { toggleTodoDone, remove, updateTodoText, addNewItem } = useTodoListCallbacks({ updateTodo, createTodo, removeTodo });

    // Takes care of any item dragging/dropping logic
    useItemDragging(droppableID)

    // Updates the items order after dragging
    useUpdateIndexes(updateTodo, droppableID)

    // Subscribes to drag actions and updates the db accordingly
    useUpdateDbOnItemAdded(droppableID, createTodo);
    useUpdateDbOnItemRemoved(droppableID, removeTodo);



    return <List className="todo__list-wrapper" {...props} ref={ref} isToday={isToday} isInThePast={isInThePast}>
        {/* Handle */}
        {children}
        {editable
            ? <EditableHeader id={id} title={title} />
            : <Header>{title}</Header>}
        {(datetime) && <DateText className="todo__list-date">{displayDate}</DateText>}
        <Droppable droppableId={droppableID} type="TODOLIST">
            {(provided, snapshot) => (
                <InnerList className="todo__list-inner"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                >
                    {todos?.map((todo: Todo, i) =>
                        <TodoItem remove={remove} updateTodoText={updateTodoText} toggleDone={toggleTodoDone} todo={todo} key={todo.id} index={i} />
                    )}
                    {provided.placeholder}
                    <AddTodoItem addNewItem={addNewItem} />
                </InnerList>
            )}
        </Droppable>
    </List>

})

const UnmemoizedTodoList = React.forwardRef<any, any>((props, ref) => <TodoContextProvider>
    <UnwrappedTodoList {...props} ref={ref} />
</TodoContextProvider>)

const TodoList = React.memo(UnmemoizedTodoList, compareObjects(['id', 'datetime', 'title', 'children']));

export default TodoList;
export { List, Header, DateText, InnerList }
export type { TodoListProps };
