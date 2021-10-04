import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import styled from '@emotion/styled';
import { colors } from '../../style/themes/colors';
import { Draggable } from 'react-beautiful-dnd';

import Todo from '../../types/Todo'
import Input from './todo-item-input/todo-item-input';
import Button, { StyledButton } from './todo-item-button/todo-item-button';
import useOptionalPortal from './../../hooks/useOptionalPortal';

const TextWrapper = styled.p`
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    display: flex;
    justify-content: space-between;
    /* position: relative; */

    padding: .2em .3em;
`
interface ItemProps {
    isDragging: boolean
    done: boolean
    editing: boolean
}

const Item = styled.div<ItemProps>`
    height: max-content;
    width: 100%;
    margin: .1rem 0 .1666666667rem 0;
    padding: 0.15rem;

    text-align: start;
    font-size: 0.75rem;

    cursor: grab;
    text-decoration: ${props => props.done && 'line-through'};
    &:not(:hover) {

        color: ${props => (props.done && !props.editing && !props.isDragging) && colors.crossedTodoColor};
    }
    height: 17.5px;

    ${TextWrapper} {
        background-color: ${props => props.isDragging && colors.primaryColorLighter};
        color: ${props => props.isDragging && colors.dark};
        opacity: ${props => props.isDragging && '0.8'};
    }

    ${props => !props.editing && `
        &:hover {
        ${StyledButton} {
            display: block;
        }
        ${TextWrapper} {
            background-color:  ${colors.primaryColorLighter};
            height: fit-content;
            z-index: 10;
            overflow: visible;
            text-overflow: unset;
            white-space: initial;
        }
    }`}
`

interface TodoItemProps {
    children?: React.ReactText
    done?: boolean
    parentId?: string
    todo: Todo
    index: number
    // parentContainerOffset: {
    //     x: number
    //     y: number
    // }
    toggleDone: (i: number) => void
    remove: (i: number) => void
    updateTodoText: (i: number, text: string) => void
    editingInitialValue?: boolean
};

const UnmemoizedTodoItem: React.FC<TodoItemProps> = ({ children, todo, parentId, index, toggleDone, remove, updateTodoText, editingInitialValue = false }) => {

    const [editing, setEditing] = React.useState(editingInitialValue)

    const onClick = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation();

        toggleDone(index)
    }, [index, toggleDone])

    const onDone = React.useCallback((e: any) => {
        e.stopPropagation()
        remove(index);
    }, [index, remove])

    const toggleEdit = React.useCallback((e) => {
        e.stopPropagation();
        setEditing(!editing)
    }, [editing])

    const onDoubleClick = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setEditing(true);
    }, [])

    const onTextChange = React.useCallback((text: string) => {
        updateTodoText(index, text);
    }, [index, updateTodoText])

    const key = todo.id
    // const key = parentId + todo.id
    const portalize = useOptionalPortal(todo.id);
    return <Draggable
        draggableId={todo.id}
        key={key}
        index={index}
    >
        {(provided, snapshot) => {
            return (portalize(snapshot.isDragging, <Item
                ref={provided.innerRef}
                key={key}                         {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={{
                    ...provided.draggableProps.style,
                    // position: 'static',
                }}
                className="todo-item"
                isDragging={snapshot.isDragging}
                editing={editing}
                done={todo.done}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
            >
                <TextWrapper>
                    {!editing
                        ? todo.text
                        : <Input
                            removeTodo={() => remove(index)}
                            defaultValue={todo.text}
                            onTextChange={onTextChange}
                            onTypingChange={setEditing} />}
                    <Button onClick={todo.done ? onDone : toggleEdit} done={todo.done} />
                </TextWrapper>
            </Item>) as React.ReactElement<HTMLElement, string | React.JSXElementConstructor<any>>
            );
        }}
    </Draggable >
}

const TodoItem = React.memo(UnmemoizedTodoItem);
// const TodoItem = UnmemoizedTodoItem;

export default TodoItem;
export { Item };


// const getItemStyle = (provided: DraggableProvided, snapshot: DraggableStateSnapshot, parentContainerOffset: { x: number, y: number }) => {
//     return snapshot.isDragging && {
//         top: (provided.draggableProps?.style as DraggingStyle).top - (document.getElementById(snapshot.draggingOver as string)?.getBoundingClientRect()?.y || 0),
//         left: (provided.draggableProps?.style as DraggingStyle).left - (parentContainerOffset.x / 2),
//         // position: snapshot.draggingOver;
//     };
// }