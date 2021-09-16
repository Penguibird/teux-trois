import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import Header from './page-header';
import Footer from './page-footer';

interface LayoutProps {
    children?: React.ReactNode
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return <>
        <Header />
        <main>
            {children}
        </main>
        <Footer />
    </>
}

export default Layout;
