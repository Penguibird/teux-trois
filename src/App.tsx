import * as React from 'react';
import { UserContextProvider } from './contexts/userContext';
import Router from './router';
import './style/main.css'
import { Fuego, FuegoProvider } from '@nandorojo/swr-firestore'
import { firebaseConfig } from './services/firebase/firebase';

interface AppProps {

};

const fuego = new Fuego(firebaseConfig);

const App: React.FC<AppProps> = ({ }) => {

    return <FuegoProvider fuego={fuego}>
        <UserContextProvider>
            <Router />
        </UserContextProvider>
    </FuegoProvider>
}

export default App;
