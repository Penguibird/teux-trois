import * as React from 'react';
import { useUserContext } from './contexts/userContext';
import LoginPage from './pages/login-page/login-page';
//import {Fragment, useState, useEffect} from 'react';
import TodosPage from './pages/todos-page/todos-page';

interface RouterProps {
    //    children: React.ReactChildren
};

const Router: React.FC<RouterProps> = ({ }) => {
    const { user } = useUserContext();
    return <React.Fragment>
        {!user
            ? <LoginPage />
            : <TodosPage />
        }
    </React.Fragment>
}

export default Router;
