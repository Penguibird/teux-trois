import * as firebaseui from 'firebaseui';
import firebaseInstance from './firebase';
import { initializeAuth, connectAuthEmulator, setPersistence, browserLocalPersistence } from "firebase/auth";

export const auth = initializeAuth(firebaseInstance);
if (window.location.hostname === "localhost") {
    console.log("Connecting to authentication emulator on port ", 9099);
    connectAuthEmulator(auth, "http://localhost:9099");
}
console.log(auth.currentUser)
setPersistence(auth, browserLocalPersistence).then(() => {
    console.log("Persistence set");
    console.log(auth.currentUser)
    
});
