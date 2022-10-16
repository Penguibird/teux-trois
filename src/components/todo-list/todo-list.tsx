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

import { MONTHNAMES } from '../../utils/dateHelpers'

import AddTodoItem from '../add-todo-item/add-todo-item';
import { TodoContextProvider, useTodoContext } from './context';
import compareObjects from '../../utils/compareObjects';
import EditableHeader from './listHeader/editable-header';
import useTodoListCallbacks from './useTodoListCallbacks';
import useTodos from './useTodos';
import { useItemMoveObserverContext } from '../../contexts/itemMoveObserverContext';
import { useDragObserverContext } from '../../contexts/dragContext';
import { TopBar } from '../../components-style/list-topbar';
import { useNumberOfListsInRowQuery } from '../../hooks/useNumberOfListsInRowQuery';
import { EventBusProvider, useEventBus } from '../../contexts/eventBusContext';
import { collection, doc, CollectionReference, DocumentData } from 'firebase/firestore';
import { useFirestore } from '../../contexts/useFirestore';
import { useUserContext } from '../../contexts/userContext';


const List = styled.div<{ isToday?: boolean, isInThePast?: boolean, numberOfLists: number }>`
    box-sizing: border-box;    
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    padding: 0em 1em;
    width: calc((100vw - (${variables.sideBarWidth}) * 2) / ${props => props.numberOfLists});
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

    ${TopBar} {
        visibility: hidden;
    }
    &:hover {
        ${TopBar} {
            visibility: visible;
        }
    }
    
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


export const getListIdFromDroppableId = (s: string) => {
	s = s.replace('droppable-', '')
	return s;
}

// Fetches no data just displays the thing
const UnwrappedTodoList = React.forwardRef<any, any>(({ headerEditingComponent, editable, children, customList, datetime, todos: initialTodos = [], title, id, isToday, isInThePast, ...props }: TodoListProps, ref: React.LegacyRef<HTMLDivElement>) => {
	const droppableID = `droppable-${id}`;
	// console.log("Rerendering todo list", droppableID)

	const eventBus = useEventBus();
	React.useEffect(() => {
		eventBus.publish('onInitialize');
	}, [eventBus])


	const displayDate = React.useMemo(() => {
		if (!datetime)
			return;
		if (typeof datetime == 'string')
			return datetime;
		const date: Date = typeof datetime == 'number' ? (new Date(datetime)) : datetime;
		return `${MONTHNAMES[date?.getMonth() ?? 0]} ${date?.getDate()}, ${date?.getFullYear()}`;
	}, [datetime])


	const { todos, setTodos } = useTodoContext();
	React.useEffect(() => {
		eventBus.publish('onUpdateList', { todoListName: title, todos });
	})

	const listId = id
	const db = useFirestore();
	const user = useUserContext();
	
	const getCollectionByListId = React.useCallback((listId) => {
		return collection(doc(collection(doc(collection(db, 'users'), user.user?.uid), customList ? 'customTodos' : 'todos'), listId), 'items')
	}, [customList, db, user.user?.uid])

	const collectionRef = React.useMemo<CollectionReference<DocumentData>>(() => {
		return getCollectionByListId(listId)
	}, [getCollectionByListId, listId]);

	//Fetches todos
	const { updateTodo, createTodo, removeTodo, updateTodoListIndexes, moveTodo } = useTodos(id, collectionRef);

	// Creates all the callbacks for the TodoItem
	const { toggleTodoDone, remove, updateTodoText, addNewItem } = useTodoListCallbacks({ updateTodo, createTodo, removeTodo });

	const { subscribe: addEventListenerOnItemRemoved } = useDragObserverContext();
	const { subscribe: addEventListenerOnItemAdded, publish: publishItemMove } = useItemMoveObserverContext();

	React.useEffect(() => {
		const unsubscribe = addEventListenerOnItemRemoved((result) => {
			if (!result.destination)
				return;


			if (result.source.droppableId === droppableID) {
				const removedItem = todos.splice(result.source.index, 1)[0];
				publishItemMove({ todo: removedItem, docRef: doc(collectionRef, removedItem.id), result }, result.destination.droppableId);
				setTodos([...todos])
			}
			if (result.destination!.droppableId === droppableID || result.source.droppableId === droppableID)
				updateTodoListIndexes();

			// if (result.destination!.droppableId !== result.source.droppableId)
			// 	removeTodo(result.draggableId);


		}, droppableID)
		return unsubscribe;
	}, [droppableID, todos, addEventListenerOnItemRemoved, publishItemMove, removeTodo, setTodos, updateTodoListIndexes, collectionRef])


	// In this one we have the todo item
	React.useEffect(() => {
		const unsubscribe = addEventListenerOnItemAdded((e) => {
			if (!e.result.destination)
				return;
			if (e.result.destination.droppableId === droppableID || e.result.source.droppableId === droppableID)
				updateTodoListIndexes();


			const todo = e.todo;
			todo.index = e.result.destination.index;
			todos.splice(e.result.destination.index, 0, e.todo);
			setTodos([...todos])

			moveTodo(todo, e.docRef, id)
		}, droppableID)
		return unsubscribe
	}, [addEventListenerOnItemAdded, droppableID, id, moveTodo, setTodos, todos, updateTodoListIndexes])

	const numberOfLists = useNumberOfListsInRowQuery({});

	const addTodoInputRef = React.useRef<HTMLInputElement>()
	const focusAddTodoInput = React.useCallback(() => {
		addTodoInputRef.current?.focus()
	}, [])

	// console.log("Rendering todo list", title, todos)
	return <List className="todo__list-wrapper" id={droppableID} {...props} ref={ref} isToday={isToday} isInThePast={isInThePast} numberOfLists={numberOfLists}>
		{/* Handle */}
		{children}
		{editable
			? <EditableHeader id={id} title={title} />
			: <Header>{title}</Header>}
		{(datetime) && <DateText className="todo__list-date">{displayDate}</DateText>}
		<Droppable droppableId={droppableID} type="TODOLIST" key={droppableID} >
			{(provided, snapshot) => (
				<InnerList className="todo__list-inner"
					{...provided.droppableProps}
					ref={provided.innerRef}
					onClick={focusAddTodoInput}
				>
					{todos?.map((todo: Todo, i) =>
						<TodoItem remove={remove} parentId={droppableID} updateTodoText={updateTodoText} toggleDone={toggleTodoDone} todo={todo} key={todo.id} index={i} />
					)}
					{provided.placeholder}
					<AddTodoItem addNewItem={addNewItem} ref={addTodoInputRef} />
				</InnerList>
			)}
		</Droppable>
	</List>

})

const UnmemoizedTodoList = React.forwardRef<any, any>((props: TodoListProps, ref) => <EventBusProvider id={props.id}>
	<TodoContextProvider>
		<UnwrappedTodoList {...props} ref={ref} />
	</TodoContextProvider>
</EventBusProvider>)

const TodoList = React.memo(UnmemoizedTodoList, compareObjects(['id', 'datetime', 'title', 'children']));

export default TodoList;
export { List, Header, DateText, InnerList }
export type { TodoListProps };
