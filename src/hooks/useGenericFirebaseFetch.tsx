
import firebase from 'firebase';
import * as React from 'react';
import { useFirestore } from '../contexts/useFirestore';


type firestoreRef = firebase.firestore.Query<firebase.firestore.DocumentData>

interface useGenericFIrebaseFetchProps {
    outputCallback: (data: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => void
    subscribeCallback?: (data: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => void
    collectionRef?: firestoreRef
    getCollectionRef?: (db: firebase.firestore.Firestore) => firestoreRef
    subscribe?: boolean
}

const useGenericFirebaseFetch = ({ getCollectionRef, outputCallback, subscribeCallback, collectionRef: propsCollectionRef, subscribe: doSubscription }: useGenericFIrebaseFetchProps) => {
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<any>(null)

    const db = useFirestore();
    const collectionRef = React.useMemo<firestoreRef>(() => {
        if (getCollectionRef) {
            const collectionRef = getCollectionRef(db);
            return collectionRef;
        } else {
            return propsCollectionRef!;
        }
    }, [db, getCollectionRef, propsCollectionRef])

    // const collectionRef = propsCollectionRef

    React.useEffect(() => {
        async function fetchData() {

            if (!collectionRef) return;
            try {
                const data = await collectionRef
                    .get();
                setLoading(false);
                outputCallback(data)

            } catch (e) {
                console.error(e)
                setLoading(false)
                setError(e)
            }
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    React.useEffect(() => {
        if (doSubscription || subscribeCallback) {

            return collectionRef.onSnapshot({
                next: (snapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => {
                    // console.log(snapshot.docChanges(), snapshot.query)

                    if (subscribeCallback) {
                        subscribeCallback(snapshot);
                    } else {
                        outputCallback(snapshot);
                    }
                },
                error: (e: firebase.firestore.FirestoreError) => { console.error(`Firebase error ${e.code} ${e.name} ${e.message}`) }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return { loading, error, collectionRef };
}

export default useGenericFirebaseFetch