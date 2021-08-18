import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';

interface PlusIconProps {
    className?: string
};

const PlusIcon: React.FC<PlusIconProps> = ({ className }) => {
    return <svg className={className} id="plus-icon" viewBox="0 0 16 16">
        <polygon points="14 7 9 7 9 2 7 2 7 7 2 7 2 9 7 9 7 14 9 14 9 9 14 9 14 7"></polygon>
    </svg>
}

export default PlusIcon;
