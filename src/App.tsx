import * as React from 'react';
import { UserContextProvider } from './contexts/userContext';
import Router from './components/router';
import './style/main.css'

interface AppProps {

};

const App: React.FC<AppProps> = ({ }) => {

    return <UserContextProvider>
        <Router />
    </UserContextProvider>
}

export default App;
