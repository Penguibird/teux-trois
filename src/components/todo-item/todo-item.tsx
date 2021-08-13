import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import styled from '@emotion/styled';
import { colors } from '../../style/themes/colors';
import { Draggable, } from 'react-beautiful-dnd';

import Todo from '../../types/Todo'
import Input from './../todo-item-input/todo-item-input';
import { variables } from '../../style/themes/variables';
import Button, { StyledButton } from '../todo-item-button/todo-item-button';

const TextWrapper = styled.p`

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    display: flex;
    justify-content: space-between;
    position: relative;

    padding: .2em .3em;
`
interface ItemProps {
    isDragging: boolean
    done: boolean
    editing: boolean
}

const Item = styled.div<ItemProps>`
    width: 100%;
    margin: .1666666667rem 0;
    padding: 0.15rem;

    text-align: start;
    font-size: 0.75rem;

    cursor: grab;
    text-decoration: ${props => props.done && 'line-through'};
    height: ${variables.lineHeight};

    ${TextWrapper} {
        background-color: ${props => props.isDragging && colors.primaryColorLighter};
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
    todo: Todo
    index: number
    toggleDone: () => void
    remove: () => void
    updateTodoText: (text: string) => void
    editingInitialValue?: boolean
};

const TodoItem: React.FC<TodoItemProps> = ({ children, todo, index, toggleDone, remove, updateTodoText, editingInitialValue = false }) => {

    const [editing, setEditing] = React.useState(editingInitialValue)

    const onClick = React.useCallback((e) => {
        toggleDone()
    }, [toggleDone])

    const onDone = React.useCallback((e: any) => {
        e.stopPropagation()
        remove();
    }, [])

    const toggleEdit = React.useCallback((e) => {
        e.stopPropagation();
        setEditing(!editing)
    }, [editing])

    const onDoubleClick = React.useCallback(() => {
        setEditing(true);
    }, [])

    return <Draggable draggableId={todo.id} index={index}>
        {(provided, snapshot) => (
            <Item
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={provided.draggableProps.style}
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
                            defaultValue={todo.text}
                            onTextChange={updateTodoText}
                            onTypingChange={setEditing}
                        />
                    }
                    <Button onClick={todo.done ? onDone : toggleEdit} done={todo.done} />
                </TextWrapper>
            </Item>
        )}
    </Draggable>
}

export default TodoItem;

