import styled from '@emotion/styled';
import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';

interface LogoProps extends Partial<React.PropsWithChildren<React.ReactHTMLElement<HTMLAnchorElement>>> {

};

const Link = styled.a<Partial<LogoProps>>`
    text-transform: uppercase;
    font-family: "alternate-gothic";
    color: white;
    font-size: 18px;
    letter-spacing: .3ch;
    font-weight: 200;
    text-decoration: none;
    margin: 0.5em;
`

const Logo: React.FC<LogoProps> = ({ children, ...props }) => {
    return <Link href="/" >teuxtrois</Link>
}

export default Logo;
