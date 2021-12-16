
import firebase from 'firebase';
import * as React from 'react';
import { useFirestore } from '../contexts/useFirestore';


type firestoreRef = firebase.firestore.Query<firebase.firestore.DocumentData>

interface useGenericFIrebaseFetchProps {
    db: firebase.firestore.Firestore
    outputCallback: (data: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => void
    subscribeCallback?: (data: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => void
    collectionRef?: firestoreRef
    getCollectionRef?: (db: firebase.firestore.Firestore) => firestoreRef
    subscribe?: boolean
}

const genericFirebaseFetch = ({ db, getCollectionRef, outputCallback, subscribeCallback, collectionRef: propsCollectionRef, subscribe: doSubscription }: useGenericFIrebaseFetchProps) => {
    const collectionRef = (() => {
        if (getCollectionRef) {
            const collectionRef = getCollectionRef(db);
            return collectionRef;
        } else {
            return propsCollectionRef!;
        }
    })();

    // const collectionRef = propsCollectionRef

    async function fetchData() {
        if (!collectionRef) return;
        const data = await collectionRef
            .get();
        outputCallback(data)

    }
    fetchData();

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

    return;
}

const useGenericFirebaseFetch = ({ getCollectionRef, outputCallback, subscribeCallback, collectionRef, subscribe: doSubscription }: Omit<useGenericFIrebaseFetchProps, "db">) => {
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<any>(null);
    const db = useFirestore();

    try {
        genericFirebaseFetch({
            db,
            collectionRef,
            outputCallback: (data) => {
                outputCallback(data);
                setLoading(false)
            }, subscribeCallback
        })
    } catch (er) {
        setLoading(false)
        setError(er)
    }

    return { loading, error, collectionRef }
}

export { genericFirebaseFetch, }
export default useGenericFirebaseFetch