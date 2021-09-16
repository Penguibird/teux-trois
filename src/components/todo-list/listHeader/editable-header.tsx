import * as React from 'react';
import { useTodoListsContext } from '../../../pages/todos-page/custom-lists-view/context';
import Input from '../../todo-item/todo-item-input/todo-item-input';
//import {Fragment, useState, useEffect} from 'react';
import { headerCss } from './header';
import UnstyledButton from '../../../components-style/unstyledButton';
import styled from '@emotion/styled';
import firebaseInstance from '../../../services/firebase/firebase';
import { useUserContext } from '../../../contexts/userContext';
import firebase from 'firebase';


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


    const user = useUserContext();
    const documentRef = React.useMemo<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>>(() => {
        const db = firebaseInstance.firestore();

        return db
            .collection('users')
            .doc(user.user?.uid)
            .collection('customTodos')
            .doc(id)
    }, [id, user.user?.uid]);
    
    const updateText = React.useCallback((text: string) => {
        documentRef.update({ name: text });
    }, [documentRef])


    const changeTodoText = React.useCallback((text: string) => {
        setTodoLists(todoLists => {
            todoLists[todoLists.findIndex(_ => _.docId === id)].name = text
            updateText(text);
            return [...todoLists];
        })
    }, [id, setTodoLists, updateText])

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
