import * as React from 'react';
import Input from '../todo-item-input/todo-item-input';
//import {Fragment, useState, useEffect} from 'react';
import Todo from '../../../../types/Todo';
import { StyledInput } from '../todo-item-input/todo-item-input';
import useOutsideAlerter from '../../../../hooks/useOutsideAlerter';
import { v4 as uuid } from 'uuid';

interface AddTodoItemProps {
    addNewItem: (t: Todo) => void
};

const AddTodoItem: React.FC<AddTodoItemProps> = ({ addNewItem }) => {
    const ref = React.useRef<HTMLInputElement>();
    
    useOutsideAlerter(ref, () => {
        closeInput()
    })
    const [text, setText] = React.useState<string>('');

    const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
    }, [])

    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setText('');
                ref.current?.blur();
            }
        }
        window.addEventListener('keydown', handler)
        return () => {
            window.removeEventListener('keydown', handler)
        }
    }, [])

    const closeInput = React.useCallback(() => {
        if (text === "") return;
        setText('')
        addNewItem({
            text,
            id: uuid(),
            done: false,
            index: -1,
        })
    }, [addNewItem, text])

    return <StyledInput
        myRef={ref}
        value={text}
        onChange={onChange}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}


        onKeyPress={(e: React.KeyboardEvent) => {
            console.log("Keypress inside an input", e)
            if (e.key === 'Enter') { closeInput() }
        }}
    />
}

export default AddTodoItem;
