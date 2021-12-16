import * as React from 'react'
import { useUserContext } from '../../contexts/userContext';
import Todo from '../../types/Todo';
import { useTodoContext } from './context';
import firebase from 'firebase';
import {genericFirebaseFetch} from '../../hooks/useGenericFirebaseFetch';
import { useFirestore } from '../../contexts/useFirestore';

function useTodos(id: string, todosCollection: 'todos' | 'customTodos') {

    const user = useUserContext();
    const { todos, setTodos } = useTodoContext();

    const db = useFirestore();
    const collectionRef = React.useMemo<firebase.firestore.CollectionReference<firebase.firestore.DocumentData>>(() => {
        return db
            .collection('users')
            .doc(user.user?.uid)
            .collection(todosCollection)
            .doc(id)
            .collection('items')

    }, [db, id, todosCollection, user.user?.uid]);

    const orderedCollectionRef = React.useMemo(
        () => collectionRef.orderBy("index"),
        [collectionRef]
    )

    const outputCallback = React.useCallback(
        (data: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => {
            const items = data.docs.map(_ => _.data()) as unknown as Todo[];

            if (items !== todos) {
                setTodos(items)
            }
            // TODO Better comparison
            // TODO surgical changes

        },
        [setTodos, todos]
    )

    const subscribeCallback = React.useCallback((data: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => {
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

    try {
        genericFirebaseFetch({
            db,
            collectionRef: orderedCollectionRef,
            outputCallback: (data) => {
                outputCallback(data);
                setLoading(false)
            }, subscribeCallback
        })
    } catch (er) {
        setLoading(false)
        setError(er)
    }



    const updateTodo = React.useCallback((id: Todo["id"]) => async (updateTodoValues: Partial<Todo>) => {
        await collectionRef?.doc(id).update(updateTodoValues);
    }, [collectionRef])

    const createTodo = async (newTodo: Todo) => {
        await collectionRef?.doc(newTodo.id).set(newTodo);
    }

    const removeTodo = async (id: Todo["id"]) => {
        // console.log("Removing todo", id)
        await collectionRef?.doc(id).delete()
            .catch(console.error);
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