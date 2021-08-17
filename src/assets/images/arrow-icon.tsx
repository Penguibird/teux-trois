import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import { RotatingDiv, RotatingDivProps } from '../../components/RotatingDiv';


const ArrowIcon: React.FC<RotatingDivProps> = ({ direction }) => {
    return <RotatingDiv direction={direction}>
        <svg id="chevron-left-icon" viewBox="0 0 16 16">
            <polygon points="3.5 8 8.5 3 12.5 3 7.5 8 12.5 13 8.5 13 3.5 8"></polygon>
        </svg>
    </RotatingDiv>
}

export default ArrowIcon;
