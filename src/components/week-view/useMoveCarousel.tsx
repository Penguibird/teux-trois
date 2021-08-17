import * as React from 'react';
import { DAYINMILIS } from "../../utils/dateHelpers";

const useMoveCarousel = (days: any[], setDays?: React.Dispatch<React.SetStateAction<number[]>>, mondayOfThisWeek?: number) => {
    const [leftShift, setLeftShift] = React.useState(0);


    const onClickMoveOneLeft = React.useCallback((e: React.MouseEvent) => {
        if (leftShift === 0 && setDays) {
            const newDay = days[0] - DAYINMILIS;
            setDays([newDay, ...days])
        } else {
            setLeftShift(prevVal => prevVal + 1)
        }
    }, [days, leftShift, setDays]);

    const onClickMoveFiveLeft = React.useCallback((e: React.MouseEvent) => {
        if (leftShift >= -4 && setDays) {
            const newDays: number[] = (new Array(5)).fill(undefined)
                .map((_, i) => days[0] - (i + 1) * DAYINMILIS)
                .reverse();
            console.log(newDays)
            setDays([...newDays, ...days]);
        } else {
            setLeftShift(prevVal => prevVal + 5)
        }
    }, [days, leftShift, setDays]);

    const onClickMoveOneRight = React.useCallback((e: React.MouseEvent) => {
        if (leftShift === - (days.length - 5) && setDays) {
            const newDay = days[days.length - 1] + DAYINMILIS;
            setDays([...days, newDay])
        }
        setLeftShift((prevValue) => prevValue - 1);
    }, [days, leftShift, setDays]);

    const onClickMoveFiveRight = React.useCallback((e: React.MouseEvent) => {
        if (leftShift <= -(days.length - 9) && setDays) {
            const newDays: number[] = (new Array(5)).fill(undefined)
                .map((_, i) => days[days.length - 1] + (i + 1) * DAYINMILIS)
            console.log(newDays)
            setDays([...days, ...newDays]);
        }
        setLeftShift((prevValue) => prevValue - 5);
    }, [days, leftShift, setDays]);


    const onToday = React.useCallback((e: React.MouseEvent) => {
        if (mondayOfThisWeek) {
            const indexOfToday = days.indexOf(mondayOfThisWeek);
            console.log({ mondayOfThisWeek, indexOfToday, days })
            setLeftShift(-indexOfToday)
        }
    }, [days, mondayOfThisWeek]);

    return {
        leftShift,
        move: {
            oneLeft: onClickMoveOneLeft,
            oneRight: onClickMoveOneRight,
            fiveLeft: onClickMoveFiveLeft,
            fiveRight: onClickMoveFiveRight
        },
        onToday: mondayOfThisWeek ? onToday : null,
    }
}

export default useMoveCarousel;