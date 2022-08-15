
import React from 'react';
import firebaseInstance from '../services/firebase/firebase';
import type { Firestore } from "firebase/firestore";
import { initializeFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from "firebase/firestore";

const FirestoreContext = React.createContext<Firestore | null>(null);

export const FirestoreProvider = ({ children }: { children: React.ReactNode }) => {
    const [loading, setLoading] = React.useState(true)
    const db = React.useRef<Firestore | null>(null);

    React.useEffect(() => {
        if (!db.current) {
            (async function fetch() {
                const firestore = initializeFirestore(firebaseInstance, {});
                try {
                    if (window.location.hostname === "localhost") {
                        console.log("Connecting to Firestore emulator on port ", 8080);
                        connectFirestoreEmulator(firestore, "localhost", 8080);
                    }
                    await enableIndexedDbPersistence(firestore);
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