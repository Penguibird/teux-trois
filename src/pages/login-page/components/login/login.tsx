import * as React from 'react';
import { useEffect } from 'react';

import firebase from 'firebase';
import * as firebaseui from 'firebaseui';
import firebaseInstance from '../../../../services/firebase/firebase';
import { useUserContext } from '../../../../contexts/userContext';

interface LoginProps {

};

const auth = firebaseInstance.auth()
var ui = new firebaseui.auth.AuthUI(auth);

const Login: React.FC<LoginProps> = ({ }) => {

    const { setUser } = useUserContext();

    auth.onAuthStateChanged((user) => {
        if (!user || !setUser)
            return;
        setUser(user)
        // console.log(user)
    })

    useEffect(() => {
        ui.start('#firebaseui-auth-container', {
            signInOptions: [
                // firebase.auth.EmailAuthProvider.PROVIDER_ID,
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                // firebase.auth.GithubAuthProvider.PROVIDER_ID
            ],
            // Other config options...
        });

    }, [])

    return <div>
        <div id="firebaseui-auth-container"></div>
        {/* <div id="loader">Loading...</div> */}
    </div>
}

export default Login;
