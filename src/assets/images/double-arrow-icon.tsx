import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import { RotatingDiv, RotatingDivProps } from '../../components-style/RotatingDiv';

interface DoubleArrowIconProps extends RotatingDivProps {

};

const DoubleArrowIcon: React.FC<DoubleArrowIconProps> = (props) => {
    return <RotatingDiv {...props}>
        <svg id="chevron-double-left-icon" viewBox="0 0 16 16">
            <path d="M0,8,5,3H9L4,8l5,5H5Zm12,5h4L11,8l5-5H12L7,8Z"></path>
        </svg>
    </RotatingDiv>
}

export default DoubleArrowIcon;
