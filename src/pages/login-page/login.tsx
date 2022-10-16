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

interface LoginProps {

};

export var ui = new firebaseui.auth.AuthUI(auth);

const Login: React.FC<LoginProps> = ({ }) => {

    const { setUser } = useUserContext();

    auth.onAuthStateChanged((user) => {
        if (!user || !setUser)
            return;
        setUser(user)
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
