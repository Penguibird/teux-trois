import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import Header from './page-header';
import Footer from './page-footer';
import { css } from '@emotion/react';

interface LayoutProps {
    children?: React.ReactNode
    header?: React.ReactNode
};

const Layout: React.FC<LayoutProps> = ({ children, header }) => {
    return <div css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: flex-start;
        gap: 0;
        &>* {
            flex: 0 0 auto;
        }
    `}>
        <Header>
            {header}
        </Header>
        <main style={{flex: '1 0 auto'}}>
            {children}
        </main>
        <Footer />
    </div>
}

export default Layout;
