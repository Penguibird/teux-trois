import * as React from 'react';
import { useEffect } from 'react';

import './login.css';

// import firebase from 'firebase/compat/app';
import 'firebaseui/dist/firebaseui.css'

import { GoogleAuthProvider } from "firebase/auth"
import { useUserContext } from '../../contexts/userContext';
import * as colors from '../../style/themes/colors';
import { auth, } from '../../services/firebase/auth';
import * as firebaseui from 'firebaseui';
import { useFirestore } from '../../contexts/useFirestore';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

interface LoginProps {

};

export var ui = new firebaseui.auth.AuthUI(auth);

const Login: React.FC<LoginProps> = ({ }) => {

    const { setUser } = useUserContext();

    const db = useFirestore();

    auth.onAuthStateChanged(async (user) => {
        if (!user || !setUser)
            return;

        const userDoc = doc(collection(db, 'users'), user.uid)
        setUser(user)
        if (!(await getDoc(userDoc)).exists()) 
            await setDoc(userDoc, {userExists: true})
        console.log("User successfulyl created")
    })

    useEffect(() => {
        ui.start('#firebaseui-auth-container', {
            autoUpgradeAnonymousUsers: true,
            signInOptions: [
                // firebase.auth.EmailAuthProvider.PROVIDER_ID,
                GoogleAuthProvider.PROVIDER_ID,
                // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                // firebase.auth.GithubAuthProvider.PROVIDER_ID
            ],
            callbacks: {
                signInFailure: (e) => {
                    if (e)
                        console.error(e);
                }
            }
            // Other config options...
        });

    }, [])


    const style = { "--border-color": colors.colors.borderGray } as React.CSSProperties;

    return <div>
        <div style={style} id="firebaseui-auth-container"></div>
        {/* <div id="loader">Loading...</div> */}
    </div>
}

export default Login;
