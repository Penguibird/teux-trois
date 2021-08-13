import * as React from 'react';
import { useUserContext } from './contexts/userContext';
import LoginPage from './pages/login-page/login-page';
//import {Fragment, useState, useEffect} from 'react';
import Header from './components/todo-list/header/header';
import WeekView from './components/week-view/week-view';

interface RouterProps {
    //    children: React.ReactChildren
};

const Router: React.FC<RouterProps> = ({ }) => {
    const { user } = useUserContext();
    return <React.Fragment>
        {!user
            ? <LoginPage />
            : <div>
                <WeekView />
            </div>
        }
    </React.Fragment>
}

export default Router;
