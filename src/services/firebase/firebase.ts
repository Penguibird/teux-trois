import firebase from "firebase";

let firebaseInstance = firebase.initializeApp({
    apiKey: env.APIKEY,
    authDomain: "teux-trois.firebaseapp.com",
    projectId: "teux-trois",
    storageBucket: "teux-trois.appspot.com",
    messagingSenderId: "728110419687",
    appId: "1:728110419687:web:ad1c57bd9af65108395c42",
    measurementId: "G-CPRYVSRVC4"
});
firebaseInstance.analytics();


export default firebaseInstance

