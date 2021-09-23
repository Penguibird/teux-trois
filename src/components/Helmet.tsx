import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import { Helmet } from 'react-helmet'

interface HeadProps {
    children: React.ReactChildren
};

const Head: React.FC<HeadProps> = ({ children }) => {
    return <Helmet>

        {children}
    </Helmet>
}

export default Head;
