import { initializeApp } from "firebase/app";
import {initializeAnalytics} from "firebase/analytics"
// require('dotenv').config();

// console.log(process.env)
let firebaseInstance = initializeApp({
    apiKey: 'AIzaSyAv7MEECvK3oDxvXKPwkwAaMm26q8uoBbM',
    authDomain: "teux-trois.firebaseapp.com",
    projectId: "teux-trois",
    storageBucket: "teux-trois.appspot.com",
    messagingSenderId: "728110419687",
    appId: "1:728110419687:web:7990f8102442b8ce395c42",
    measurementId: "G-89GN0912B4"
});
initializeAnalytics(firebaseInstance)

export default firebaseInstance

