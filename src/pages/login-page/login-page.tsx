import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import Login from './components/login/login';
import Layout from './../../components-style/layout';
import styled from '@emotion/styled';

interface LoginPageProps {

};

const H1 = styled.h1`
    text-transform: uppercase;
    margin: auto;
    font-family: 'alternate-gothic';
`

const LoginPage: React.FC<LoginPageProps> = ({ }) => {

    return <Layout>
        <H1>Log in</H1>
        <Login />
    </Layout>
}

export default LoginPage;
