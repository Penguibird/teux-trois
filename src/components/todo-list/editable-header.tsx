import * as React from 'react';
import { useTodoListsContext } from '../../contexts/customTodoListContext';
import Input from '../todo-item/todo-item-input/todo-item-input';
//import {Fragment, useState, useEffect} from 'react';
import { headerCss } from '../../components-style/header/header';
import UnstyledButton from '../../components-style/unstyledButton';
import styled from '@emotion/styled';


const HeaderButton = styled(styled(UnstyledButton)(headerCss))`
    cursor: text;
`

interface EditableHeaderProps {
    title: string,
    id: string,
};

const EditableHeader: React.FC<EditableHeaderProps> = ({ title, id }) => {
    const [editing, setEditing] = React.useState(false)

    const { setTodoLists } = useTodoListsContext();

    const changeTodoText = React.useCallback((text: string) => {
        setTodoLists(todoLists => {
            todoLists[todoLists.findIndex(_ => _.docId === id)].name = text
            return [...todoLists];
        })
    }, [id, setTodoLists])

    const onTypingChange = React.useCallback((b: boolean) => {
        setEditing(b)
    }, [])

    const setEditingTrue = React.useCallback(() => {
        setEditing(true)
    }, [])

    return <>
        {editing
            ? <Input css={headerCss} onTextChange={changeTodoText} onTypingChange={onTypingChange} defaultValue={title} />
            : <HeaderButton onClick={setEditingTrue} >{title}</HeaderButton>}
    </>
}

export default EditableHeader;
