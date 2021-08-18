import * as React from 'react';
import { InnerList, List } from './todo-list';
//import {Fragment, useState, useEffect} from 'react';


interface AddTodoListProps {
    children: React.ReactChildren | Element | React.ReactElement<any, any>
};

const AddTodoList: React.FC<AddTodoListProps> = ({ children }) => {
    return <List>
        {children}
        <InnerList />
    </List>
}

export default AddTodoList;
