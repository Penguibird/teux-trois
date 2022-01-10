import * as React from 'react'
import { useUserContext } from '../../contexts/userContext';
import Todo from '../../types/Todo';
import { useTodoContext } from './context';
import { genericFirebaseFetch } from '../../hooks/useGenericFirebaseFetch';
import { useFirestore } from '../../contexts/useFirestore';
import type { CollectionReference, DocumentData, QuerySnapshot, } from "firebase/firestore"
import { orderBy, query, deleteDoc, setDoc, updateDoc, getDoc, collection, doc } from "firebase/firestore"
function useTodos(id: string, todosCollection: 'todos' | 'customTodos') {

    const user = useUserContext();
    const { todos, setTodos } = useTodoContext();

    const db = useFirestore();
    const collectionRef = React.useMemo<CollectionReference<DocumentData>>(() => {
        return collection(doc(collection(doc(collection(db, 'users'), user.user?.uid), todosCollection), id), 'items')

    }, [db, id, todosCollection, user.user?.uid]);

    const orderedCollectionRef = React.useMemo(
        () => query(collectionRef, orderBy("index")),
        [collectionRef]
    )

    const subscribeCallback = React.useCallback((data: QuerySnapshot<DocumentData>) => {
        data.docChanges().forEach((v) => {
            // console.log(id, v.type, v.doc)
            const todo: Todo = v.doc.data() as any as Todo;
            if (v.type === 'added') {
                setTodos((todos: Todo[]) => {
                    if (!todos.some((t) => t.id === todo.id)) {
                        todos.splice(v.newIndex, 0, todo);
                        return [...todos];
                    } else {
                        return todos;
                    }
                })
            }
            if (v.type === 'removed') {
                setTodos((todos: Todo[]) =>
                    [...todos.filter(t => t.id !== todo.id)]
                )
            }
            if (v.type === 'modified') {
                setTodos((todos: Todo[]) => {
                    const index = todos.findIndex((_) => _.id === todo.id);
                    if (index !== -1) {
                        todos[index] = todo;
                        return [...todos];
                    } else {
                        return todos;
                    }
                })
            }
        })
    }, [setTodos])


    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<any>(null)

    React.useEffect(() => {

        try {
            genericFirebaseFetch({
                db,
                collectionRef: orderedCollectionRef,
                outputCallback: (data) => {
                    const items = data.docs.map((_: any) => _.data()) as unknown as Todo[];

                    if (items !== todos) {
                        setTodos(items)
                    }

                    setLoading(false)
                },
                subscribeCallback: (data) => {
                    console.log("Subscribe Callback called: ", id, " changing stuff ", data.metadata.hasPendingWrites, data.metadata)
                    if (data.metadata.hasPendingWrites) return;

                    const items = data.docs.map((_: any) => _.data()) as unknown as Todo[];

                    if (items !== todos) {
                        setTodos(items)
                    }

                    // setLoading(false)
                },
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