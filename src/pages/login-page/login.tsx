import * as React from 'react';
import { useEffect } from 'react';

import './login.css';

// import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css'

import firebaseInstance from '../../services/firebase/firebase';
import { initializeAuth, connectAuthEmulator, GoogleAuthProvider } from "firebase/auth"
import { useUserContext } from '../../contexts/userContext';
import * as colors from '../../style/themes/colors';

interface LoginProps {

};

const auth = initializeAuth(firebaseInstance)
if (window.location.hostname === "localhost") {
    console.log("Connecting to authentication emulator on port ", 9099)
    connectAuthEmulator(auth, "http://localhost:9099");
}
var ui = new firebaseui.auth.AuthUI(auth);

const Login: React.FC<LoginProps> = ({ }) => {

    const { setUser } = useUserContext();

    auth.onAuthStateChanged((user) => {
        if (!user || !setUser)
            return;
        setUser(user)
    })

    useEffect(() => {
        ui.start('#firebaseui-auth-container', {
            signInOptions: [
                // firebase.auth.EmailAuthProvider.PROVIDER_ID,
                GoogleAuthProvider.PROVIDER_ID,
                // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                // firebase.auth.GithubAuthProvider.PROVIDER_ID
            ],
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
