import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const StyledInputCss = css`
    padding: 0;
    margin: 0;
    /* margin-left: .4em; */
    margin-bottom: -0.1em;
    border: none;
    outline: none !important;
    width: 100%;
`

export const StyledIpnut = styled.input(StyledInputCss)