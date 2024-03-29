import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';

interface EditIconProps {
    className?: string

};

const EditIcon: React.FC<EditIconProps> = ({className }) => {
    return <svg className={className} id="edit-icon" viewBox="0 0 16 16">
        <path d="M2,14,3.5,9.5l3,3ZM10,3l3,3,1.5-1.5-3-3ZM4.5,8.5l3,3L12,7,9,4Z"></path>
    </svg>
}

export default EditIcon;
