
import * as React from 'react';
import { useFirestore } from '../contexts/useFirestore';
import type { Firestore, DocumentData, QuerySnapshot, FirestoreError, Query } from "firebase/firestore"
import { onSnapshot, getDocs } from "firebase/firestore"

type firestoreRef = Query<DocumentData>

interface useGenericFIrebaseFetchProps {
    db: Firestore
    outputCallback: (data: QuerySnapshot<DocumentData>) => void
    subscribeCallback?: (data: QuerySnapshot<DocumentData>) => void
    collectionRef?: firestoreRef
    getCollectionRef?: (db: Firestore) => firestoreRef
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
        const data = await getDocs(collectionRef);
        outputCallback(data)

    }
    fetchData();

    if (doSubscription || subscribeCallback) {

        return onSnapshot(collectionRef, {
            next: (snapshot: QuerySnapshot<DocumentData>) => {
                // console.log(snapshot.docChanges(), snapshot.query)

                if (subscribeCallback) {
                    subscribeCallback(snapshot);
                } else {
                    outputCallback(snapshot);
                }
            },
            error: (e: FirestoreError) => { console.error(`Firebase error ${e.code} ${e.name} ${e.message}`) }
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