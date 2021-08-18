import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';

interface HomeIconProps {
    className?: string

};

const HomeIcon: React.FC<HomeIconProps> = ({ className}) => {
    return <svg className={className} id="home-icon" viewBox="0 0 16 16">
        <polygon points="6 14 3 14 3 8 1 8 8 1 15 8 13 8 13 14 10 14 10 9 6 9 6 14"></polygon>
    </svg>
}

export default HomeIcon;
