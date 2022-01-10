
import * as React from 'react';
import { collection, doc, orderBy, query } from 'firebase/firestore';
import type { QuerySnapshot, DocumentData } from 'firebase/firestore';
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
        () =>
            collection(doc(collection(db, 'users')
                , user.user?.uid)
                , 'customTodos'),
        [db, user.user?.uid]
    );

    const outputCallback = React.useCallback(
        (data: QuerySnapshot<DocumentData>) => {
            if (!setTodoLists) return;
            setTodoLists(
                data.docs.map(doc => ({
                    docId: doc.id,
                    name: doc.data().name
                }) as unknown as TodoList)
            )
        }, [setTodoLists])

    const orderedCollectionRef = React.useMemo(
        () => query(collectionRef, orderBy('index')),
        [collectionRef]
    );

    const { } = useGenericFirebaseFetch({
        outputCallback,
        collectionRef: orderedCollectionRef,
        subscribe: true,
    })

    return { collectionRef }
}