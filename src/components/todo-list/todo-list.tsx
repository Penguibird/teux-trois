import * as React from 'react';
import styled from '@emotion/styled';
import { Droppable, } from "react-beautiful-dnd";

import TodoItem, { Item } from './components/todo-item/todo-item';
import Header from './components/header/header';

import { colors, variables } from '../../style/themes/colors.js'
import Todo from '../../types/Todo'
import useItemDragging from './hooks/useItemDragging';

import { MONTHNAMES } from '../../utils/dateHelpers'

import AddTodoItem from './components/add-todo-item/add-todo-item';
import useTodos from './hooks/useTodos';
import useUpdateIndexes from './hooks/useUpdateIndexes';
import { TodoContextProvider, useTodoContext } from './contexts/todosContext';
import useUpdateDbOnItemAdded from './hooks/useUpdateDbOnItemAdded';
import useUpdateDbOnItemRemoved from './hooks/useUpdateDbOnItemRemoved';
import useTodoListCallbacks from './hooks/useTodoListCallbacks';
import compareObjects from './../../utils/compareObjects';


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

const DateText = styled.p({
    textTransform: 'uppercase',
    fontSize: '.6111111111rem',
    marginTop: '.2777777778rem'
})

const InnerList = styled.ul({
    marginTop: '2em',
    width: '100%',
    flex: '1 1 auto',
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
    datetime?: string | Date | number
    // datetimeNumber?: number
    title: string
    id: string
    isToday?: boolean
    isInThePast?: boolean
    customList?: boolean
};

// Fetches no data just displays the thing
const UnwrappedTodoList: React.FC<TodoListProps> = ({ children, customList, datetime, todos: initialTodos = [], title, id, isToday, isInThePast, ...props }) => {
    const droppableID = `droppable-${id}`;
    console.log("Rerendering todo list", droppableID)

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


    const displayDate = React.useMemo(() => {
        if (!datetime)
            return;
        if (typeof datetime == 'string')
            return datetime;
        const date: Date = typeof datetime == 'number' ? (new Date(datetime)) : datetime;

        return `${MONTHNAMES[date?.getMonth() ?? 0]} ${date?.getDate()}, ${date?.getFullYear()}`;

    }, [datetime])

    return <List className="todo__list-wrapper" {...props} isToday={isToday} isInThePast={isInThePast}>
        <Header>{title}</Header>
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

}

const UnmemoizedTodoList: React.FC<TodoListProps> = (props) => <TodoContextProvider>
    <UnwrappedTodoList {...props} />
</TodoContextProvider>

const TodoList = React.memo(UnmemoizedTodoList, compareObjects(['id', 'datetime', 'title', 'children']));

export default TodoList;
export type { TodoListProps };
