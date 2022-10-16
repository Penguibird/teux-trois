import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import Login from './login';
import Layout from '../../components-style/layout';
import styled from '@emotion/styled';
import * as colors from '../../style/themes/colors';

interface LoginPageProps {

};

const LoginWrapper = styled.div`
    width:100%;
    height: 90vh;
    display: grid;
    place-items: center;
`

const H1 = styled.h1`
    text-transform: uppercase;
    margin: auto;
    width: max-content;
    font-family: 'alternate-gothic';
    font-size: 60px;
`

const LoginInner = styled.div`

`
const P = styled.p`
    font-family: 'inter';
    margin-top: 4rem;
    color: ${colors.colors.dark};
    text-align: center;
    font-size: .8rem;
`
const Highlighted = styled.span`
    color: ${colors.colors.primaryColor};
`

const LoginPage: React.FC<LoginPageProps> = ({ }) => {

    return <Layout>
        <LoginWrapper>
            <LoginInner>
                <H1>Log in</H1>
                <Login />
                <P>Try it, it's <Highlighted>free!</Highlighted></P>
            </LoginInner>
        </LoginWrapper>
    </Layout>
}

export default LoginPage;
