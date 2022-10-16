import * as React from 'react'
import { useUserContext } from '../../contexts/userContext';
import Todo from '../../types/Todo';
import { useTodoContext } from './context';
import { genericFirebaseFetch } from '../../hooks/useGenericFirebaseFetch';
import { useFirestore } from '../../contexts/useFirestore';
import { CollectionReference, DocumentData, DocumentReference, QuerySnapshot, writeBatch, } from "firebase/firestore"
import { orderBy, query, deleteDoc, setDoc, updateDoc, collection, doc } from "firebase/firestore"
import { useEventBus } from '../../contexts/eventBusContext';

const parseData = (data: QuerySnapshot) => data.docs.map((_: any) => _.data()) as unknown as Todo[];


/**
 * On outgoing operation increment the counter for any todo by one
 * On incoming operation decrement
 * Ignore incoming operations unless counter == 0
 */
const dbOperationCounter = new Proxy({} as Record<string, number>, {
	get: (target, key) => {
		if (typeof key == 'symbol')
			return;
		if (target[key] == null || Number.isNaN(target[key]))
			return 0;
	},
	set: (t, key, val) => {
		if (typeof key == 'symbol')
			return false;
		t[key] = val
		return true;
	},

}) as Record<string, number>

function useTodos(listId: string, collectionRef: CollectionReference<unknown>) {


	const { todos, setTodos } = useTodoContext();

	const eventBus = useEventBus();

	const db = useFirestore();

	const orderedCollectionRef = React.useMemo(
		() => query(collectionRef, orderBy("index")),
		[collectionRef]
	)

	const [loading, setLoading] = React.useState(true)
	const [error, setError] = React.useState<any>(null)

	const outputCallback = React.useCallback((data) => {
		if (data.metadata.hasPendingWrites)
			return;
		const items = parseData(data)
		setTodos(items)
	}, [setTodos])

	React.useEffect(() => {
		try {
			genericFirebaseFetch({
				db,
				collectionRef: orderedCollectionRef as any,
				outputCallback: (data) => {
					const doStuff = (todos: Todo[]) => {
						setLoading(false)
						setTodos(todos)
					}

					const promise = eventBus.publish('onFetchList', parseData(data));
					if (promise)
						promise.then(doStuff);
					else
						doStuff(parseData(data))

				},
				subscribeCallback: (d: QuerySnapshot<DocumentData>) => {
					const count = dbOperationCounter[listId]
					console.log(count)
					if (count == 0)
						outputCallback(d)
				},
			})
		} catch (er) {
			setLoading(false)
			setError(er)
		}



		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])


	const updateTodo = React.useCallback((id: Todo["id"]) => async (updateTodoValues: Partial<Todo>) => {
		dbOperationCounter[listId]++;
		await updateDoc(doc(collectionRef, id), updateTodoValues)
		dbOperationCounter[listId]--;
	}, [collectionRef, listId])

	const createTodo = async (newTodo: Todo) => {
		dbOperationCounter[listId]++;
		await setDoc(doc(collectionRef, newTodo.id), newTodo)
		dbOperationCounter[listId]--;
	}

	const removeTodo = async (id: Todo["id"]) => {
		dbOperationCounter[listId]++;
		await deleteDoc(doc(collectionRef, id))
		dbOperationCounter[listId]--;
	}

	const updateTodoListIndexes = React.useCallback(async () => {
		const batch = writeBatch(db)
		todos.forEach((todo, i) => {
			if (todo.index === i)
				return;
			todo.index = i;
			batch.update(doc(collectionRef, todo.id), { index: i })
		})

		dbOperationCounter[listId]++;
		await batch.commit();
		dbOperationCounter[listId]--;
	}, [collectionRef, db, listId, todos])

	const moveTodo = React.useCallback(async (todo: Todo, oldTodoDocRef: DocumentReference<unknown>, newListId: string) => {
		const batch = writeBatch(db)
		batch.delete(oldTodoDocRef)
		batch.set(doc(collectionRef, todo.id), todo)

		dbOperationCounter[listId]++;
		await batch.commit();
		dbOperationCounter[listId]--;
	}, [collectionRef, db, listId])

	return { loading, error, updateTodo, createTodo, removeTodo, updateTodoListIndexes, moveTodo }
}

export default useTodos