import * as React from 'react'
import { useUserContext } from '../../contexts/userContext';
import firebaseInstance from './../../services/firebase/firebase';

function useTodos<T>(initialValue: T, id: string) {
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(null)
    const [todos, setTodos] = React.useState<T>(initialValue)

    const user = useUserContext();

    React.useEffect(() => {
        async function fetchData() {
            const db = firebaseInstance.firestore();
            if (!user.user?.uid) return;
            const docRef = db
                .collection('users')
                .doc(user.user?.uid)
                .collection('todos')
                .doc(id);
            // console.log(docRef)
            try {
                const data = await docRef.get();
                if (!data.exists) {
                    await docRef.set({ todos: [] });
                } else {
                    console.log("Data", data.data())
                    setTodos(data.data() as T);
                    setLoading(false)
                }
            } catch (e) {
                console.error(e)
                setLoading(false)
                setError(e)
            }
        }
        fetchData();
    }, [id, user.user?.uid])

    return { loading, error, todos, setTodos }
}

export default useTodos