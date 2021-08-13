import * as React from 'react';
import styled from '@emotion/styled'

interface HeaderProps {
    children: string
};

const StyledH1 = styled.h2({
    width: '100%',
    textAlign: 'center',
    fontSize: '2rem',
    textTransform: 'uppercase',
    fontFamily: '"alternate-gothic"'
})

const Header: React.FC<HeaderProps> = ({ children }) => {
    return <StyledH1>{children}</StyledH1>
}

export default Header;
