
import firebaseInstance from '../services/firebase/firebase';
import * as React from 'react';
import firebase from 'firebase';
import { TodoList } from '../types/TodoList';
import useGenericFirebaseFetch from './useGenericFirebaseFetch';
import { useUserContext } from '../contexts/userContext';
import { useTodoListsContext } from '../contexts/customTodoListContext';

export const useCustomLists = () => {
    const user = useUserContext();
    
    const { setTodoLists } = useTodoListsContext();
    
    const db = firebaseInstance.firestore();
    const collectionRef = React.useMemo(
        () => db
            .collection('users')
            .doc(user.user?.uid)
            .collection('customTodos'),
        [db, user.user?.uid]
    );

    const outputCallback = React.useCallback(
        (data: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => {
            if (!setTodoLists) return;
            setTodoLists(
                data.docs.map(doc => ({
                    docId: doc.id,
                    name: doc.data().name
                }) as unknown as TodoList)
            )
        }, [setTodoLists])

    const orderedCollectionRef = React.useMemo(
        () => collectionRef.orderBy('index'),
        [collectionRef]
    );

    const { } = useGenericFirebaseFetch({
        outputCallback,
        collectionRef: orderedCollectionRef,
    })

    return {collectionRef}
}