import * as React from 'react';
import { useUserContext } from './contexts/userContext';
import LoginPage from './pages/login-page/login-page';
//import {Fragment, useState, useEffect} from 'react';
import Header from './components/todo-list/components/header';

interface RouterProps {
    //    children: React.ReactChildren
};

const Router: React.FC<RouterProps> = ({ }) => {
    const { user } = useUserContext();
    return <React.Fragment>
        {!user
            ? <LoginPage />
            : <div>
                <Header>Title</Header>
            </div>
        }
    </React.Fragment>
}

export default Router;
