
import React from 'react';
import firebaseInstance from './../services/firebase/firebase';
import firebase from 'firebase';

const FirestoreContext = React.createContext<firebase.firestore.Firestore | null>(null);

export const FirestoreProvider = ({ children }: { children: React.ReactNode }) => {
    const db = firebaseInstance.firestore();


    return <FirestoreContext.Provider value={db}>
        {children}
    </FirestoreContext.Provider>
}

export const useFirestore = () => {
    const db = React.useContext(FirestoreContext);
    if (!db) {
        throw new Error("Firestore cannot be used outside context or before initialization")
    }
    return db;
}