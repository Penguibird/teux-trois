import * as React from 'react';
import { SideBar, Button } from '../../../components-style/sidebar/sidebar';
import { getTransformValue, MainWrapperGrid, TodoListGrid } from '../week-view/week-view';
//import { Fragment, useState, useEffect, useMemo } from 'react';
import TodoList from '../../../components/todo-list/todo-list';
import ArrowIcon from '../../../assets/images/arrow-icon';
import DoubleArrowIcon from '../../../assets/images/double-arrow-icon';
import styled from '@emotion/styled';
import { colors, variables } from '../../../style/themes/colors';
import PlusIcon from '../../../assets/images/plus-icon';
import AddTodoList from '../../../components/todo-list/add-todo-list';
import { headerCss } from '../../../components/todo-list/listHeader/header';
import AddTodoItem from '../../../components/add-todo-item/add-todo-item';
import { v4 } from 'uuid';

import { TodoList as TodoListType } from '../../../types/TodoList'
import { TodoListsContextProvider, useTodoListsContext } from './context';
import { useCustomLists } from './useCustomLists';
import { DroppableProvided, DroppableStateSnapshot, DropResult, Draggable, DraggableProvided, DraggableStateSnapshot, DraggableRubric } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';
import HandleIcon from '../../../assets/images/handle-icon';
import { useDragObserverContext } from '../../../contexts/dragContext';
import useMoveCustomLists from './useMoveCustomLists';
import UnstyledButton from './../../../components-style/unstyledButton';
import CrossIcon from './../../../assets/images/cross-icon';
import { TopBar } from './../../../components-style/list-topbar';


const IconButton = styled(UnstyledButton)`
    width: min-content;
    svg {
        height: 100%;
    }
    &:hover {
        svg {
            fill: ${colors.primaryColorLighter};
        }
    }
`

export const Handle = styled(IconButton)`
    height: 1.3em;
    grid-column: 2 / span 1;
    place-self: center;

`;

const DeleteButton = styled(IconButton)`
    grid-column: 1 / span 1;
    place-self: left;
    height: 1.3em;
`


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
    width: 100%;
    padding: 0 .5em;
    box-sizing: border-box;
    svg {
        fill: ${colors.ribbonContrastDefaultGray};
    }
    
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 3em 1fr 3em;

    place-items: center;
    /* padding: 0 1em; */
`

const LeftJustifiedButton = styled(Button)`
    grid-column: 1 / span 1;
`
const RightJustifiedButton = styled(Button)`
    grid-column: 3 / span 1;
`

const DotsList = styled.ol`
    display: flex;
    flex-direction: row;
    align-items: center;
`

const StyledLi = styled.li`
    padding: .3333333333rem;
    display: grid;
    place-content: center;
`

const buttonWidth = variables.dotButtonWidth;

const Label = styled.div`
    display: none;
    background-color: ${colors.primaryColorLighter};
    opacity: 0;
    transform: opacity .1s ease, display .1s ease;
    position: absolute;
    margin-left: calc(${buttonWidth} / 2);
    transform: translate(-50%, -150%);

    padding: .3rem .4444444444rem;
    text-transform: uppercase;
    font-size: .8rem;
    color: ${colors.ribbonContrastDarkGray};

    &::after {
        border-color: ${colors.primaryColorLighter} transparent transparent transparent;
        border-style: solid;
        border-width: .3333333333rem .3333333333rem 0 .3333333333rem;
        bottom: -.3333333333rem;
        content: "";
        height: 0;
        left: 50%;
        position: absolute;
        transform: translateX(-50%);
        width: 0;
    }

`

const Dot = styled(UnstyledButton) <{ light?: boolean }>`
    background-color: ${props => props.light ? colors.ribbonContrastLightGray : colors.ribbonContrastDarkGray};
    height: ${buttonWidth};
    width: ${buttonWidth};
    margin: 0 auto;

    border-radius: 100%;
    &:hover {
        background-color: ${colors.primaryColorLighter};
        transition: background-color .05s ease-in-out;
    }
    &:hover ~ ${Label} {
        display: block;
        opacity: 1;

    }
`

interface CustomListsViewProps {

};

const UnwrappedCustomListView: React.FC<CustomListsViewProps> = ({ }) => {
    const ctx = useTodoListsContext();
    const { setTodoLists } = ctx
    const todoLists = ctx.todoLists as TodoListType[];

    const { collectionRef } = useCustomLists();

    const { leftShift, move, showLeftButtons, showRightButtons, } = useMoveCustomLists(todoLists);

    const [showCustomLists, setShowCustomLists] = React.useState(true);
    const toggleCustomLists = React.useCallback(() => {
        setShowCustomLists(prevVal => !prevVal);
    }, [])


    const [addingTodoList, setAddingTodoList] = React.useState(false);
    const startAddingNewList = React.useCallback(() => {
        move.makeSpaceForNewList();
        setAddingTodoList(true)
    }, [move])

    const onAddNewItem = React.useCallback((t: string) => {
        if (!setTodoLists) return;
        const id = v4();
        const newTodoList: TodoListType = {
            docId: id,
            name: t,
            index: todoLists.length,
        };
        collectionRef
            .doc(id)
            .set(newTodoList as TodoListType);
        setTodoLists((prevVal: TodoListType[]) => [...prevVal, newTodoList]);
        setAddingTodoList(false)

    }, [collectionRef, setTodoLists, todoLists.length])

    const onCancelAddTodoList = React.useCallback(() => {
        setAddingTodoList(false);
    }, [])

    const removeTodoList = (i: number) => () => {
        collectionRef.doc(todoLists[i].docId).delete();
        todoLists.splice(i, 1);
        setTodoLists([...todoLists]);
        if (leftShift !== 0) move.oneLeft();
    }

    const onDragEnd = React.useCallback((result: DropResult,) => {
        if (result.destination) {

            const [item] = todoLists.splice(result.source.index, 1);
            todoLists.splice(result.destination?.index, 0, item);
            todoLists
                // .splice(0, Math.max(result.source.index, result.destination.index))
                .forEach((todoList, i) => {
                    todoList.index = i;
                    collectionRef.doc(todoList.docId).update({ index: i })
                })
            setTodoLists([...todoLists]);

            // Update the database of all the shifted lists
        }
    }, [collectionRef, setTodoLists, todoLists])

    const { subscribe } = useDragObserverContext();
    React.useEffect(() => {
        const unsubscribe = subscribe(onDragEnd, "CUSTOMLISTS");
        return unsubscribe;
    }, [onDragEnd, subscribe])




    return <BottomWrapperGrid>
        <TopRibbon>
            <LeftJustifiedButton size='2em' onClick={toggleCustomLists}>
                <ArrowIcon direction={showCustomLists ? 'down' : 'up'} />
            </LeftJustifiedButton>
            <DotsList>
                {todoLists.map((v, i) => <StyledLi key={i}>
                    <Dot as="button" onClick={move.target(i)} />
                    <Label>{v.name}</Label>
                </StyledLi>)}
            </DotsList>
            <RightJustifiedButton onClick={startAddingNewList}>
                <PlusIcon />
            </RightJustifiedButton>
        </TopRibbon>
        {showCustomLists && <>
            <SideBar left>
                {showLeftButtons && <>
                    <Button size='4em' red onClick={move.oneLeft}>
                        <ArrowIcon direction='left' />
                    </Button>
                    <Button onClick={move.fiveLeft}>
                        <DoubleArrowIcon direction='left' />
                    </Button>
                </>}
            </SideBar>
            <Droppable
                renderClone={generateTodoList(todoLists, removeTodoList)}
                type="CUSTOMLISTS"
                droppableId="CUSTOMLISTS"
                direction='horizontal'
            >
                {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) =>
                    <TodoListGrid
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        leftShift={getTransformValue(leftShift, todoLists.length)}
                    >
                        {todoLists.map((v, i) =>
                            <Draggable key={v.docId} draggableId={v.docId} index={i}>
                                {generateTodoList(todoLists, removeTodoList)}
                            </Draggable>
                        )}
                        {provided.placeholder}
                        {addingTodoList && <AddTodoList>
                            <AddTodoItem focusOnRender css={headerCss} addNewItem={onAddNewItem} onCancel={onCancelAddTodoList} />
                        </AddTodoList>}
                    </TodoListGrid>
                }
            </Droppable>


            <SideBar>
                {showRightButtons && <>
                    <Button size='4em' red flipped onClick={move.oneRight}>
                        <ArrowIcon direction='right' />
                    </Button>
                    <Button flipped onClick={move.fiveRight}>
                        <DoubleArrowIcon direction='right' />
                    </Button>
                </>}
            </SideBar>
        </>
        }

    </BottomWrapperGrid>
}

const CustomListsView = (props: CustomListsViewProps) => {
    return <TodoListsContextProvider>
        <UnwrappedCustomListView {...props} />
    </TodoListsContextProvider>
}

export default CustomListsView;


function generateTodoList(todoLists: TodoListType[], removeTodoList: (i: number) => () => void) {
    return (provided: DraggableProvided, snapshot: DraggableStateSnapshot, rubric: DraggableRubric) => {
        const v = todoLists[rubric.source.index];
        return <TodoList
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={{
                ...provided.draggableProps.style,
            }}
            editable
            customList
            id={v.docId}
            title={v.name}
            key={v.docId}
        >
            <TopBar>
                <DeleteButton onClick={removeTodoList(rubric.source.index)}>
                    <CrossIcon />
                </DeleteButton>
                <Handle {...provided.dragHandleProps}>
                    <HandleIcon />
                </Handle>
            </TopBar>
        </TodoList>;
    };
}