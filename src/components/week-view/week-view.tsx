import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import styled from '@emotion/styled';
import { DAYINMILIS, DAYSOFTHEWEEK, getDateId } from '../../utils/dateHelpers';
import TodoList from './../todo-list/todo-list';
import { ItemMoveObserverContextProvider } from '../../contexts/itemMoveObserverContext';
import { DragObserverContextProvider, useDragObserverContext } from '../../contexts/dragContext';
import { DragDropContext } from 'react-beautiful-dnd';



interface WeekViewProps {

};

const StyledDiv = styled.div`
    margin-top: 80px;
    height: 60vh;
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: stretch;
    flex-wrap: nowrap;
    & > * {
        flex: 1 1 0;
        
    }
`


const UnwrappedWeekView: React.FC<WeekViewProps> = ({ }) => {
    const date = new Date();
    const today = Date.now();
    const dayOfTheWeek = date.getDay();
    const mondayOfThisWeek = today - ((dayOfTheWeek - 1) * DAYINMILIS);
    const daysOfTheWeek: number[] = (new Array(5)).fill(undefined).map((v, i) => (mondayOfThisWeek + (DAYINMILIS * i)));
    console.log(daysOfTheWeek)
    // const dayOfTheWeekIDs: string[] = daysOfTheWeek.map(getDateId);

    const { publish } = useDragObserverContext();

    return <DragDropContext onDragEnd={(result) => publish(result, result.source.droppableId)}>
        <StyledDiv>
            {
                daysOfTheWeek.map((v, i) => <TodoList id={getDateId(v)} key={i} datetime={new Date(v)} title={DAYSOFTHEWEEK[i]} />)
            }
        </StyledDiv>
    </DragDropContext>
}

const WeekView: React.FC<WeekViewProps> = (props) => {
    return <ItemMoveObserverContextProvider>
        <DragObserverContextProvider>
            <UnwrappedWeekView {...props} />
        </DragObserverContextProvider>
    </ItemMoveObserverContextProvider>
}

export default WeekView;
