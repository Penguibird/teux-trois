
import React from 'react';
import firebaseInstance from './../services/firebase/firebase';
import firebase from 'firebase';

const FirestoreContext = React.createContext<firebase.firestore.Firestore | null>(null);

export const FirestoreProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = React.useState(true)
    const db = React.useRef<firebase.firestore.Firestore | null>(null);

    React.useEffect(() => {
        if (!db.current) {
            (async function fetch() {
                const firestore = firebaseInstance.firestore();
                try {
                    if (window.location.hostname === "localhost") {
                        console.log("Connecting to Firestore emulator");
                        firestore.useEmulator("localhost", 8080);
                    }
                    await firestore.enablePersistence();
                } catch (error) {
                    console.error(error)
                }
                db.current = firestore;
                setLoading(false)
            })()
        }
    }, [])



    return <FirestoreContext.Provider value={db.current}>
        {loading
            ? 'loading'
            : children
        }
    </FirestoreContext.Provider>
}

export const useFirestore = () => {
    const db = React.useContext(FirestoreContext);
    if (!db) {
        throw new Error("Firestore cannot be used outside context or before initialization")
    }
    return db;
}