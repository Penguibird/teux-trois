import * as React from 'react';
import { useTodoListsContext } from '../../../pages/todos-page/custom-lists-view/context';
import Input from '../../todo-item/todo-item-input/todo-item-input';
//import {Fragment, useState, useEffect} from 'react';
import { headerCss } from './header';
import UnstyledButton from '../../../components-style/unstyledButton';
import styled from '@emotion/styled';
import { useUserContext } from '../../../contexts/userContext';
import firebase from 'firebase';
import { useFirestore } from '../../../contexts/useFirestore';
import { css } from '@emotion/react';
import { useTodoContext } from '../context';


const HeaderButton = styled(styled(UnstyledButton)(headerCss))`
    cursor: text;
`

const inputCss = css`
    ${headerCss};
    border: none;
    padding: 0;
`

interface EditableHeaderProps {
    title: string,
    id: string,
};

const EditableHeader: React.FC<EditableHeaderProps> = ({ title, id }) => {
    const [editing, setEditing] = React.useState(false)

    const { setTodoLists } = useTodoListsContext();


    const user = useUserContext();
    const db = useFirestore();
    const documentRef = React.useMemo<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>>(() => {

        return db
            .collection('users')
            .doc(user.user?.uid)
            .collection('customTodos')
            .doc(id)
    }, [db, id, user.user?.uid]);

    const updateText = React.useCallback((text: string) => {
        documentRef.update({ name: text });
    }, [documentRef])

    const { todos } = useTodoContext();

    
    const handleEmptyInput = async () => {
        if (todos.length > 0) {
            changeTodoText("NONAME")
        } else {
            // remove list
            setTodoLists(todoLists => todoLists.filter(t => t.docId !== id))
            await documentRef.delete()
        }
    }

    const changeTodoText = (text: string) => {
        if (text === "") {
            handleEmptyInput();
            return;
        }
        setTodoLists(todoLists => {
            todoLists[todoLists.findIndex(_ => _.docId === id)].name = text
            updateText(text);
            return [...todoLists];
        })
    }



    const onTypingChange = React.useCallback((b: boolean) => {
        setEditing(b)
    }, [])

    const setEditingTrue = React.useCallback(() => {
        setEditing(true)
    }, [])




    return <>
        {editing
            ? <Input removeTodo={handleEmptyInput} css={inputCss} onTextChange={changeTodoText} onTypingChange={onTypingChange} defaultValue={title} />
            : <HeaderButton onClick={setEditingTrue} >{title}</HeaderButton>}
    </>
}

export default EditableHeader;
