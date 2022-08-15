import * as React from 'react';
import { InnerList, List } from './todo-list';
//import {Fragment, useState, useEffect} from 'react';
import { TopBar } from '../../components-style/list-topbar';
import HandleIcon from '../../assets/images/handle-icon';
import { Handle } from '../../pages/todos-page/custom-lists-view/custom-lists-view';
import { useNumberOfListsInRowQuery } from '../../hooks/useNumberOfListsInRowQuery';


interface AddTodoListProps {
    children: React.ReactChildren | Element | React.ReactElement<any, any>
};

const AddTodoList: React.FC<AddTodoListProps> = ({ children }) => {
    const numberOfLists = useNumberOfListsInRowQuery({});

    return <List numberOfLists={numberOfLists}>
        <TopBar>
            <Handle>
                <HandleIcon />
            </Handle>
        </TopBar>
        {children}
        <InnerList />
    </List>
}

export default AddTodoList;
