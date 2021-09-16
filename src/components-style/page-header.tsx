import styled from '@emotion/styled';
import * as React from 'react';
import colors from '../style/themes/colors';
//import {Fragment, useState, useEffect} from 'react';
import Logo from './logo';


interface HeaderProps extends Partial<React.PropsWithChildren<React.ReactHTMLElement<HTMLDivElement>>> {
};

const StyledHeader = styled.header<Partial<HeaderProps>>`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 3.555555555rem;
    box-sizing: border-box;
    top: 0;
    height: auto;
    background-color: ${colors.colors.primaryColor};

`

const Header:React.FC<HeaderProps> = ({children, ...props}) => {
    return <StyledHeader {...props}>
        <Logo />
        {children}
    </StyledHeader>
}

export default Header;

