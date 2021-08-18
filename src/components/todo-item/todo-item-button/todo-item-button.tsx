import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import styled from '@emotion/styled';
import { colors } from '../../../style/themes/colors';
import CrossIcon from '../../../assets/images/cross-icon';
import EditIcon from '../../../assets/images/edit-icon';

const StyledButton = styled.button`
    display: none;
    padding: 0.05em;
    color: ${colors.primaryColor};
    
    &:hover {
        color: ${colors.dark};
        svg {
            fill: ${colors.primaryColor};
        }
    }
    width: 1.2em;
    height: 1em;
    margin: 0;
    flex: 0 0 auto;
    border-radius: 0;
    border: none;
    background: none;
    margin-right: .5em;
    cursor: pointer; 
    svg {
        width: 100%;
        height: auto;
    }  
`


interface ButtonProps {
    done: boolean
    onClick: (e?: React.MouseEvent) => void
};

const Button: React.FC<ButtonProps> = ({ done, onClick, ...props }) => {
    return <StyledButton onClick={onClick} {...props}>
        {done
            ? <CrossIcon />
            : <EditIcon />
        }
    </StyledButton>
}

export default Button;
export { StyledButton };