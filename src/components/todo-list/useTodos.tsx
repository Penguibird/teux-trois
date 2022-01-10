import * as React from 'react'
import { useUserContext } from '../../contexts/userContext';
import Todo from '../../types/Todo';
import { useTodoContext } from './context';
import { genericFirebaseFetch } from '../../hooks/useGenericFirebaseFetch';
import { useFirestore } from '../../contexts/useFirestore';
import type { CollectionReference, DocumentData, QuerySnapshot, } from "firebase/firestore"
import { orderBy, query, deleteDoc, setDoc, updateDoc, collection, doc } from "firebase/firestore"
import { useEventBus } from '../../contexts/eventBusContext';
import { resolve } from 'path';

const parseData = (data: QuerySnapshot) => data.docs.map((_: any) => _.data()) as unknown as Todo[];
function useTodos(id: string, todosCollection: 'todos' | 'customTodos') {

    const user = useUserContext();
    const { todos, setTodos } = useTodoContext();

    const eventBus = useEventBus();

    const db = useFirestore();
    const collectionRef = React.useMemo<CollectionReference<DocumentData>>(() => {
        return collection(doc(collection(doc(collection(db, 'users'), user.user?.uid), todosCollection), id), 'items')

    }, [db, id, todosCollection, user.user?.uid]);

    const orderedCollectionRef = React.useMemo(
        () => query(collectionRef, orderBy("index")),
        [collectionRef]
    )

    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<any>(null)

    const outputCallback = React.useCallback((data) => {
        if (data.metadata.hasPendingWrites) return;
        const items = parseData(data)
        setTodos(items)
    }, [setTodos])

    React.useEffect(() => {
        try {
            genericFirebaseFetch({
                db,
                collectionRef: orderedCollectionRef,
                outputCallback: (data) => {
                    const doStuff = (todos: Todo[]) => {
                        setLoading(false)
                        setTodos(todos)
                    }

                    const promise = eventBus.publish('onFetchList', parseData(data));
                    if (promise) {
                        promise.then(doStuff);
                    } else {
                        doStuff(parseData(data))
                    }
                },
                subscribeCallback: outputCallback,
            })
        } catch (er) {
            setLoading(false)
            setError(er)
        }



        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const updateTodo = React.useCallback((id: Todo["id"]) => async (updateTodoValues: Partial<Todo>) => {
        await updateDoc(doc(collectionRef, id), updateTodoValues)
    }, [collectionRef])

    const createTodo = async (newTodo: Todo) => {
        await setDoc(doc(collectionRef, newTodo.id), newTodo)
    }

    const removeTodo = async (id: Todo["id"]) => {
        // console.log("Removing todo", id)
        console.log("Removing ", id)
        await deleteDoc(doc(collectionRef, id))
    }

    const updateTodoListIndexes = React.useCallback(() => {
        todos.forEach((todo, i) => {
            if (todo.index === i) return;
            todo.index = i;
            updateTodo(todo.id)({ index: i });
        })
    }, [todos, updateTodo])

    return { loading, error, updateTodo, createTodo, removeTodo, updateTodoListIndexes }
}

export default useTodos