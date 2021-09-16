import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';

interface HandleIconProps {
    className?: string
};

const HandleIcon: React.FC<HandleIconProps> = ({ className}) => {
    return <svg id="drag-handle-icon" viewBox="0 0 16 16" className={className}> 
        <path d="M3,6A1,1,0,1,1,2,5,1,1,0,0,1,3,6ZM6,5A1,1,0,1,0,7,6,1,1,0,0,0,6,5Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,10,5Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,14,5ZM2,9a1,1,0,1,0,1,1A1,1,0,0,0,2,9ZM6,9a1,1,0,1,0,1,1A1,1,0,0,0,6,9Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,10,9Zm4,0a1,1,0,1,0,1,1A1,1,0,0,0,14,9Z"></path>
    </svg>
}

export default HandleIcon;
