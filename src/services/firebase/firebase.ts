import { initializeApp } from "firebase/app";
import {initializeAnalytics} from "firebase/analytics"
import { firebaseOptions } from "./firebaseOptions";
// require('dotenv').config();

// console.log(process.env)
let firebaseInstance = initializeApp(firebaseOptions);
initializeAnalytics(firebaseInstance)

export default firebaseInstance

