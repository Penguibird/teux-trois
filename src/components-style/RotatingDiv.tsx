import styled from "@emotion/styled";

const RotatingDiv = styled.div<RotatingDivProps>`
    transform: rotate(${props =>
        props.direction === 'left' ? '0deg'
            : props.direction === 'right' ? '180deg'
                : props.direction === 'down' ? '270deg'
                    : props.direction === 'up' && '90deg'});
    transition: transform .10s ease-in-out,
                rotate .10s ease-in-out;
`

interface RotatingDivProps {
    direction: 'right' | 'left' | 'up' | 'down'
};

export { RotatingDiv };
export type { RotatingDivProps };