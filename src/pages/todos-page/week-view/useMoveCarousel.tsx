import * as React from 'react';
import { DAYINMILIS } from "../../../utils/dateHelpers";

const useMoveCarousel = (days: any[], setDays?: React.Dispatch<React.SetStateAction<number[]>>, mondayOfThisWeek?: number, number = 5) => {
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
            const newDays: number[] = (new Array(number)).fill(undefined)
                .map((_, i) => days[0] - (i + 1) * DAYINMILIS)
                .reverse();
            setDays([...newDays, ...days]);
        } else {
            setLeftShift(prevVal => prevVal + number)
        }
    }, [days, leftShift, number, setDays]);

    const onClickMoveOneRight = React.useCallback((e: React.MouseEvent) => {
        if (leftShift === - (days.length - number) && setDays) {
            const newDay = days[days.length - 1] + DAYINMILIS;
            setDays([...days, newDay])
        }
        setLeftShift((prevValue) => prevValue - 1);
    }, [days, leftShift, number, setDays]);

    const onClickMoveFiveRight = React.useCallback((e: React.MouseEvent) => {
        if (leftShift <= -(days.length - 9) && setDays) {
            const newDays: number[] = (new Array(number)).fill(undefined)
                .map((_, i) => days[days.length - 1] + (i + 1) * DAYINMILIS)
            setDays([...days, ...newDays]);
        }
        setLeftShift((prevValue) => prevValue - number);
    }, [days, leftShift, number, setDays]);


    const onToday = React.useCallback(() => {
        if (mondayOfThisWeek) {
            const indexOfToday = days.indexOf(mondayOfThisWeek);
            if (number < 3) {
                setLeftShift(- indexOfToday - 1)
            } else {
                setLeftShift(-indexOfToday)
            }
        }
    }, [days, mondayOfThisWeek, number]);

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