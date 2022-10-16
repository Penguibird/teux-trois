import styled from '@emotion/styled';
import * as React from 'react';
import * as colors from '../style/themes/colors';
//import {Fragment, useState, useEffect} from 'react';

interface FooterProps {
    children?: React.ReactNode
};

const StyledFooter = styled.footer`
    border-top: 5px solid ${colors.colors.borderGray};
    color: #bfbfbf;
    display: flex;
    flex-wrap: wrap;
    font-size: var(--font-size-s);
    justify-content: space-between;
    line-height: var(--line-height);
    padding: 1.7777777778rem 2.5rem;

`

const Footer: React.FC<FooterProps> = ({ }) => {
    return <StyledFooter>

    </StyledFooter>
}

export default Footer;
