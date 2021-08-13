import * as React from 'react'
import { useUserContext } from '../../../contexts/userContext';
import firebaseInstance from '../../../services/firebase/firebase';
import Todo from '../../../types/Todo';
import { useTodoContext } from '../contexts/todosContext';

function useTodos( id: string) {
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(null)
    const { setTodos } = useTodoContext();

    const user = useUserContext();

    const collectionRef = React.useMemo(() => {
        if (!user.user?.uid) return;
        const db = firebaseInstance.firestore();
        const collectionRef = db
            .collection('users')
            .doc(user.user?.uid)
            .collection('todos')
            .doc(id)
            .collection('items');
        return collectionRef;
    }, [id, user.user?.uid])

    React.useEffect(() => {
        async function fetchData() {

            console.log("Fetching dataaaa")
            if (!collectionRef) return;
            try {
                const data = await collectionRef
                    .orderBy("index")
                    .get();

                console.log(data.docs.map(_ => _.data()))
                setLoading(false);
                setTodos(data.docs.map(_ => _.data()) as unknown as Todo[])

            } catch (e) {
                console.error(e)
                setLoading(false)
                setError(e)
            }
        }
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updateTodo = (id: Todo["id"]) => async (updateTodoValues: Partial<Todo>) => {
        await collectionRef?.doc(id).update(updateTodoValues);
    }

    const createTodo = async (newTodo: Todo) => {
        console.log(newTodo)
        await collectionRef?.doc(newTodo.id).set(newTodo);
    }

    const removeTodo = (id: Todo["id"]) => async () => {
        await collectionRef?.doc(id).delete();
    }
    return { loading, error, updateTodo, createTodo, removeTodo }
}

export default useTodos