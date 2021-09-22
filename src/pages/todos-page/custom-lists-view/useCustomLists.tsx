
import * as React from 'react';
import firebase from 'firebase';
import { TodoList } from '../../../types/TodoList';
import useGenericFirebaseFetch from '../../../hooks/useGenericFirebaseFetch';
import { useUserContext } from '../../../contexts/userContext';
import { useTodoListsContext } from './context';
import { useFirestore } from '../../../contexts/useFirestore';

export const useCustomLists = () => {
    const user = useUserContext();
    
    const { setTodoLists } = useTodoListsContext();
    
    const db = useFirestore();
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
        subscribe: true,
    })

    return {collectionRef}
}