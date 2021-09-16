import * as React from 'react'
import { useUserContext } from '../../contexts/userContext';
import firebaseInstance from '../../services/firebase/firebase';
import Todo from '../../types/Todo';
import { useTodoContext } from './context';
import firebase from 'firebase';
import useGenericFirebaseFetch from '../../hooks/useGenericFirebaseFetch';

function useTodos(id: string, todosCollection: 'todos' | 'customTodos') {

    const user = useUserContext();
    const { setTodos } = useTodoContext();

    const collectionRef = React.useMemo<firebase.firestore.CollectionReference<firebase.firestore.DocumentData>>(() => {
        const db = firebaseInstance.firestore();

        return db
            .collection('users')
            .doc(user.user?.uid)
            .collection(todosCollection)
            .doc(id)
            .collection('items')

    }, [id, todosCollection, user.user?.uid]);

    const orderedCollectionRef = React.useMemo(
        () => collectionRef.orderBy("index"),
        [collectionRef]
    )

    const outputCallback = React.useCallback(
        (data: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => { setTodos(data.docs.map(_ => _.data()) as unknown as Todo[]) },
        [setTodos]
    )
    const { loading, error } = useGenericFirebaseFetch({
        collectionRef: orderedCollectionRef, outputCallback
    })


    const updateTodo = (id: Todo["id"]) => async (updateTodoValues: Partial<Todo>) => {
        await collectionRef?.doc(id).update(updateTodoValues);
    }

    const createTodo = async (newTodo: Todo) => {
        await collectionRef?.doc(newTodo.id).set(newTodo);
    }

    const removeTodo = async (id: Todo["id"]) => {
        await collectionRef?.doc(id).delete().then(console.log).catch(console.log);
    }
    return { loading, error, updateTodo, createTodo, removeTodo }
}

export default useTodos