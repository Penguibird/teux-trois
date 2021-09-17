import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import WeekView from './week-view/week-view';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { DragObserverContextProvider, useDragObserverContext } from '../../contexts/dragContext';
import { ItemMoveObserverContextProvider } from '../../contexts/itemMoveObserverContext';
import CustomListsView from './custom-lists-view/custom-lists-view';
import Layout from './../../components-style/layout';
import blurAllInputs from './../../utils/blurAllInputs';
import styled from '@emotion/styled';
import { useUserContext } from '../../contexts/userContext';
import Dropdown from './../../components/dropdown/dropdown';
import firebaseInstance from '../../services/firebase/firebase';
import { css } from '@emotion/css';
import colors from '../../style/themes/colors';
import UnstyledButton from './../../components-style/unstyledButton';

const DraggablePortal = styled.div`
    pointer-events: none;
    width: 100%;
    height: 100%;
    position: absolute;
`

interface TodosPageProps {

};


const dropDownStyle = css`
    color: ${colors.colors.white};
    padding: 1em;
    padding-right: 0;
    font-weight: 700;
    font-size: 12px;
    font-family: Inter,"Helvetica Neue",Helvetica,-apple-system,system-ui,sans-serif;
`
const DropdownItem = styled(UnstyledButton)`
    background-color: ${colors.colors.borderGray};
    font-size: 13px;
    padding: .8em 1.2em;
    &:hover {
        background-color: ${colors.colors.primaryColorLighter};
    }
`

const UnwrappedTodosPage: React.FC<TodosPageProps> = ({ }) => {

    const { publish } = useDragObserverContext();
    const onDragEnd = (result: DropResult) => {
        if (result.type === "CUSTOMLISTS") {
            publish(result, "CUSTOMLISTS")
        } else {
            publish(result, result.source.droppableId)
        }
    }

    const user = useUserContext();

    const logOut = React.useCallback(() => {
        firebaseInstance.auth().signOut().then(() => {
            window.location.reload();
        });
    }, [])

    const openSettings = React.useCallback(() => {
        alert("Settings go here")
    }, [])

    return <Layout
        header={
            <Dropdown.Wrapper>
                <Dropdown.Toggle className={dropDownStyle}>
                    {user.user?.displayName || user.user?.email || "Usernam goes here"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <DropdownItem onClick={logOut}>
                        Sign out
                    </DropdownItem>
                    <DropdownItem onClick={openSettings}>
                        Settings
                    </DropdownItem>
                </Dropdown.Menu>
            </Dropdown.Wrapper>
        }
    >
        <DragDropContext onDragStart={blurAllInputs} onDragEnd={onDragEnd}>
            <DraggablePortal id="draggable" />
            <WeekView />
            <CustomListsView />
        </DragDropContext>
    </Layout>
}

const TodosPage = (props: TodosPageProps) => {
    return <ItemMoveObserverContextProvider>
        <DragObserverContextProvider>
            <UnwrappedTodosPage {...props} />
        </DragObserverContextProvider>
    </ItemMoveObserverContextProvider>
}

export default TodosPage;
