import * as React from 'react';
import { useUserContext } from '../../contexts/userContext';
import { SideBar, Button } from '../sidebar/sidebar';
import { getTransformValue, MainWrapperGrid, TodoListGrid } from '../week-view/week-view';
//import {Fragment, useState, useEffect} from 'react';
import useGenericFirebaseFetch from './../../hooks/useGenericFirebaseFetch';
import firebase from 'firebase';
import TodoList from './../todo-list/todo-list';
import ArrowIcon from './../../assets/images/arrow-icon';
import DoubleArrowIcon from './../../assets/images/double-arrow-icon';
import useMoveCarousel from './../week-view/useMoveCarousel';
import styled from '@emotion/styled';
import {colors} from '../../style/themes/colors';


const BottomWrapperGrid = styled(MainWrapperGrid)`
    margin-top: 0;
    grid-template-rows: 2.5em 1fr;
    & > * {
        grid-row: 2 / 3;
    }
`

const TopRibbon = styled.div`
    grid-row: 1 / 2;
    grid-column: 1 / -1;
    background-color: ${colors.borderGray};
    
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0 1em;
`

const LeftJustifiedButton = styled(Button)`
    justify-content: flex-start;
`
const RightJustifiedButton = styled(Button)`
    justify-content: flex-end;
`

const DotsList = styled.ol`

`

const Dot = styled.li`

`

interface CustomListsViewProps {

};

interface TodoListType {
    docId: string,
    name: string
};

// type TodoListType = string

const CustomListsView: React.FC<CustomListsViewProps> = ({ }) => {

    const [todoLists, setTodoLists] = React.useState<TodoListType[]>([])



    const user = useUserContext();

    const getCollectionRef = React.useCallback(
        (db: firebase.firestore.Firestore) => db
            .collection('users')
            .doc(user.user?.uid)
            .collection('customTodos'),
        [user.user?.uid]
    )
    const outputCallback = React.useCallback(
        (data: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => {
            setTodoLists(
                data.docs.map(doc => ({
                    docId: doc.id,
                    name: doc.data().name
                }) as unknown as TodoListType)
            )
        }, [setTodoLists])

    const { } = useGenericFirebaseFetch({
        outputCallback,
        getCollectionRef,
    })

    const { leftShift, move } = useMoveCarousel(todoLists);
    const showLeftButtons = React.useMemo<boolean>(
        () => leftShift !== 0,
        [leftShift]
    )
    const showRightButtons = React.useMemo<boolean>(
        () => todoLists.length > 5 && leftShift <= todoLists.length - 4,
        [leftShift, todoLists.length]
    )


    console.log(todoLists)
    return <BottomWrapperGrid>
        <TopRibbon>
            <LeftJustifiedButton>
                <ArrowIcon direction="down" />
            </LeftJustifiedButton>

            <DotsList>
                {todoLists.map((v, i) => <Dot><button /></Dot>)}
            </DotsList>

            <RightJustifiedButton>

            </RightJustifiedButton>
        </TopRibbon>
        <SideBar left>
            {showLeftButtons && <React.Fragment>
                <Button size='4em' red onClick={move.oneLeft}>
                    <ArrowIcon direction='left' />
                </Button>
                <Button onClick={move.fiveLeft}>
                    <DoubleArrowIcon direction='left' />
                </Button>
            </React.Fragment>}
        </SideBar>
        <TodoListGrid leftShift={getTransformValue(leftShift, todoLists.length)}>
            {todoLists.map((v, i) => <TodoList id={v.docId} title={v.name} key={v.docId} customList />)}
        </TodoListGrid>
        <SideBar>
            {showRightButtons && <React.Fragment>
                <Button size='4em' red flipped onClick={move.oneRight}>
                    <ArrowIcon direction='right' />
                </Button>
                <Button flipped onClick={move.fiveRight}>
                    <DoubleArrowIcon direction='right' />
                </Button>
            </React.Fragment>}
        </SideBar>
    </BottomWrapperGrid>
}

export default CustomListsView;
