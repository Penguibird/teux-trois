import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import styled from '@emotion/styled';
import { DAYINMILIS, DAYSOFTHEWEEK, getDateId } from '../../../utils/dateHelpers';
import TodoList from '../../../components/todo-list/todo-list';
import ArrowIcon from '../../../assets/images/arrow-icon';
import DoubleArrowIcon from '../../../assets/images/double-arrow-icon';
import { variables } from '../../../style/themes/colors';
import HomeIcon from '../../../assets/images/home-icon';
import useMoveCarousel from './useMoveCarousel';
import { SideBar, Button, ButtonProps } from '../../../components-style/sidebar/sidebar';


interface WeekViewProps {

};


const MainWrapperGrid = styled.div`
    display: grid;
    grid-template-columns: ${variables.sideBarWidth} calc(100vw - (${variables.sideBarWidth} * 2)) ${variables.sideBarWidth};
    overflow: hidden;
    margin-top: 80px;
`
const TodoListGrid = styled.div<{ leftShift?: string }>`
    height: 40vh;
    width: max-content;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: stretch;
    flex-wrap: nowrap;
    transform: translateX(${props => props.leftShift});
    transition: transform 0.15s ease-in-out;

    & > * {
        /* flex: 1 1 0; */
    }
`
const ShiftingButton = styled(Button) <ButtonProps>`
    transform: translateX(${props => props.flipped && '-'}.2em);
    transition: transform .1s ease-in-out;
`

const UnwrappedWeekView: React.FC<WeekViewProps> = ({ }) => {

    const dateObjects = React.useRef({
        mondayOfThisWeek: -1,
        today: -1,
        daysOfTheWeek: [] as number[],
    })
    if (dateObjects.current.today === -1) {
        // console.log("New date being calculated")
        dateObjects.current = getDateObjectsForTheCurrentWeek();
    }
    const { daysOfTheWeek, mondayOfThisWeek, today } = dateObjects.current;

    const [days, setDays] = React.useState<number[]>(daysOfTheWeek);


    // All the callbacks for moving the carousel
    const { leftShift, onToday, move } = useMoveCarousel(days, setDays, mondayOfThisWeek);

    // Gets the value for the transform css function from the leftShift state


    return <MainWrapperGrid>
        <SideBar left>
            <ShiftingButton size='4em' red onClick={move.oneLeft}>
                <ArrowIcon direction='left' />
            </ShiftingButton>
            <ShiftingButton onClick={move.fiveLeft}>
                <DoubleArrowIcon direction='left' />
            </ShiftingButton>
            <ShiftingButton onClick={onToday!}>
                <HomeIcon />
            </ShiftingButton>
        </SideBar>
        <TodoListGrid leftShift={getTransformValue(leftShift, days.length)}>
            {days.map((v, i) => <TodoList isToday={v === today} isInThePast={v < today} id={getDateId(v)} key={getDateId(v)} datetime={v} title={DAYSOFTHEWEEK[getWeekDayIndexFromDateTimeNumber(v)]} />)}
        </TodoListGrid >
        <SideBar>
            <ShiftingButton size='4em' red flipped onClick={move.oneRight}>
                <ArrowIcon direction='right' />
            </ShiftingButton>
            <ShiftingButton flipped onClick={move.fiveRight}>
                <DoubleArrowIcon direction='right' />
            </ShiftingButton>
        </SideBar>
    </MainWrapperGrid>
}

const WeekView: React.FC<WeekViewProps> = (props) => {
    return <UnwrappedWeekView {...props} />

}

export default WeekView;
export { MainWrapperGrid, TodoListGrid, getTransformValue }


const getWeekDayIndexFromDateTimeNumber = (day: number) => {
    const weekDayIndex = (new Date(day).getDay() - 1)
    return weekDayIndex === -1 ? 6 : weekDayIndex;
};

const getDateObjectsForTheCurrentWeek = () => {
    const date = new Date();
    const today = Date.now();
    const dayOfTheWeek = date.getDay();
    const mondayOfThisWeek = today - ((dayOfTheWeek - 1) * DAYINMILIS);
    const daysOfTheWeek: number[] = (new Array(5)).fill(undefined).map((v, i) => (mondayOfThisWeek + (DAYINMILIS * i)));
    return { today, mondayOfThisWeek, daysOfTheWeek }
}

const getTransformValue = (n: number, arrayLength: number) => {
    return `${(n / arrayLength) * 100}%`;
}