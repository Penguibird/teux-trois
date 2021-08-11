import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import styled from '@emotion/styled';
import { DAYINMILIS , DAYSOFTHEWEEK, getDateId } from '../../utils/dateHelpers';
import TodoList from './../todo-list/todo-list';



interface WeekViewProps {

};

const StyledDiv = styled.div`
`


const WeekView: React.FC<WeekViewProps> = ({ }) => {
    const date = new Date();
    const today = Date.now();
    const dayOfTheWeek = date.getDay();
    const mondayOfThisWeek = today - (dayOfTheWeek * DAYINMILIS);
    const daysOfTheWeek: number[] = (new Array(5)).map((v, i) => (mondayOfThisWeek + (DAYINMILIS * i)));
    // const dayOfTheWeekIDs: string[] = daysOfTheWeek.map(getDateId);
    return <StyledDiv>
        {
            daysOfTheWeek.map((v, i) => <TodoList id={getDateId(v)} key={i} datetime={new Date(v)} title={DAYSOFTHEWEEK[i]} />)
        }
    </StyledDiv>
}

export default WeekView;
