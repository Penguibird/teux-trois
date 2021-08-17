
import firebaseInstance from './../services/firebase/firebase';
import firebase from 'firebase';
import * as React from 'react';


type firestoreRef = firebase.firestore.Query<firebase.firestore.DocumentData>

interface useGenericFIrebaseFetchProps {
    outputCallback: (data: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => void
    collectionRef?: firestoreRef
    getCollectionRef?: (db: firebase.firestore.Firestore) => firestoreRef
}

const useGenericFirebaseFetch = ({ getCollectionRef, outputCallback, collectionRef: propsCollectionRef }: useGenericFIrebaseFetchProps) => {
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(null)


    const collectionRef = React.useMemo<firestoreRef>(() => {
        if (getCollectionRef) {
            const db = firebaseInstance.firestore();
            const collectionRef = getCollectionRef(db);
            return collectionRef;
        } else {
            return propsCollectionRef!;
        }
    }, [getCollectionRef, propsCollectionRef])

    React.useEffect(() => {
        async function fetchData() {

            console.log("Fetching dataaaa")
            if (!collectionRef) return;
            try {
                const data = await collectionRef
                    .get();
                console.log(data.docs.map(_ => _.data()))
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

    return { loading, error }
}

export default useGenericFirebaseFetch