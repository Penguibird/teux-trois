import * as React from 'react';
import { UserContextProvider } from './contexts/userContext';
import Router from './components/router';
import './style/main.css'
import { FirestoreProvider } from './contexts/useFirestore';

interface AppProps {

};

const App: React.FC<AppProps> = ({ }) => {

    return <UserContextProvider>
        <FirestoreProvider>

            <Router />
        </FirestoreProvider>
    </UserContextProvider>
}

export default App;
