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

interface TodoItemProps extends Partial<React.PropsWithChildren<React.ReactElement<HTMLDivElement>>> {
    // children?: React.ReactText
    innerRef: any
    done?: boolean
    todo: Todo
    index: number
    // parentContainerOffset: {
    //     x: number
    //     y: number
    // }
    toggleDone: (i: number) => void
    delete: (i: number) => void
    updateTodoText: (i: number, text: string) => void
    editingInitialValue?: boolean
    isDragging: boolean
    style: any
};

const UnmemoizedTodoItem: React.FC<TodoItemProps> = ({ children, innerRef, isDragging, todo, index, toggleDone, delete: remove, updateTodoText, editingInitialValue = false, ...props }) => {

    const [editing, setEditing] = React.useState(editingInitialValue)

    const onClick = React.useCallback((e) => {
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

    const onDoubleClick = React.useCallback(() => {
        setEditing(true);
    }, [])

    const onTextChange = React.useCallback((text: string) => {
        updateTodoText(index, text);
    }, [index, updateTodoText])

    const portalize = useOptionalPortal(todo.id);


    return <Item
        {...props}
        ref={innerRef}
        isDragging={isDragging}
        className="todo-item"
        editing={editing}
        done={todo.done}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
    >
        <TextWrapper>
            {!editing
                ? todo.text
                : <Input
                    defaultValue={todo.text}
                    onTextChange={onTextChange}
                    onTypingChange={setEditing} />}
            <Button onClick={todo.done ? onDone : toggleEdit} done={todo.done} />
        </TextWrapper>
    </Item>
}

const TodoItem = React.memo(UnmemoizedTodoItem);

export default TodoItem;
export { Item };


// const getItemStyle = (provided: DraggableProvided, snapshot: DraggableStateSnapshot, parentContainerOffset: { x: number, y: number }) => {
//     return snapshot.isDragging && {
//         top: (provided.draggableProps?.style as DraggingStyle).top - (document.getElementById(snapshot.draggingOver as string)?.getBoundingClientRect()?.y || 0),
//         left: (provided.draggableProps?.style as DraggingStyle).left - (parentContainerOffset.x / 2),
//         // position: snapshot.draggingOver;
//     };
// }