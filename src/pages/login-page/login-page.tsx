import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import Login from './components/login/login';

interface LoginPageProps {
   
};

const LoginPage:React.FC<LoginPageProps> = ({}) => {
    
    return <main>
        <Login />
    </main>
}

export default LoginPage;
