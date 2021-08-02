import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import { Helmet } from 'react-helmet'

interface HeadProps {
    children: React.ReactChildren
};

const Head: React.FC<HeadProps> = ({ children }) => {
    return <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true' />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" />
        {children}
    </Helmet>
}

export default Head;
