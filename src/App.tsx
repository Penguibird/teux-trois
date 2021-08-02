import * as React from 'react';
import { UserContextProvider } from './contexts/userContext';
import Router from './router';
import './style/main.css'

interface AppProps {

};

const App: React.FC<AppProps> = ({ }) => {

    return <UserContextProvider>
        Hello World
        <Router />
    </UserContextProvider>
}

export default App;
