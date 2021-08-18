import { colors, variables } from "../../style/themes/colors";
import { CSSLength } from "../../types/CssTypes";
import styled from '@emotion/styled';
import UnstyledButton from '../unstyledButton';

const SideBar = styled.div<{ left?: boolean }>`
    background-color: ${colors.background};
    z-index: 10;
    width: ${variables.sideBarWidth};
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 0 1em;
    ${props => props.left
        ? `border-right: ${colors.borderGray} ${variables.borderWidth} solid;`
        : `border-left: ${colors.borderGray} ${variables.borderWidth} solid;`
    }

    &> * +* {
        margin-top: .8em;
    }
`

interface ButtonProps {
    size?: CSSLength
    red?: boolean
    flipped?: boolean
}
const Button = styled(UnstyledButton) <ButtonProps>`
    width: ${props => props.size || '2.25em'};

    fill: ${props => props.red ? colors.primaryColor : colors.borderGray};
    &:hover {

        svg {
            fill: ${colors.primaryColor};
        }
    }
`



export { SideBar, Button, };
export type { ButtonProps }