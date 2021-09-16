import * as React from 'react';
import styled from '@emotion/styled'
import { css } from '@emotion/react';

interface HeaderProps {
    children: string
};

const headerCss = css({
    width: '100%',
    textAlign: 'center',
    fontSize: '2rem',
    textTransform: 'uppercase',
    fontFamily: '"alternate-gothic"'
})

const StyledH1 = styled.h2(headerCss)

const Header: React.FC<HeaderProps> = ({ children }) => {
    return <StyledH1>{children}</StyledH1>
}

export default Header;

export { headerCss }
