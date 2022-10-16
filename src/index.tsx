import React from 'react';
// @ts-ignore
import {createRoot} from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
// require('dotenv').config({path: path.resolve('../.env')})

// import firebaseInstance from './services/firebase/firebase'

// ReactDOM.render(
//   // <React.StrictMode>
//   //   <App />
//   // </React.StrictMode>,
//   <App />,
//   document.getElementById('root')
// );

createRoot(document.getElementById('root')
).render(<App />)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}