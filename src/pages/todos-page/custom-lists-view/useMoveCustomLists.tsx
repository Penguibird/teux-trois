
import * as React from 'react';
import type { TodoList } from '../../../types/TodoList';

const useMoveCustomLists = (todoLists: TodoList[], numberOfLists = 5) => {
    const [leftShift, setLeftShift] = React.useState(0);

    const move = {
        oneLeft: () => {
            setLeftShift(n => n + 1)
        },
        oneRight: () => {
            setLeftShift(n => n - 1)
        },
        fiveLeft: () => {
            setLeftShift(n => {
                if (n > numberOfLists) {
                    return n + numberOfLists
                } else {
                    return 0
                }
            })
        },
        fiveRight: () => {
            setLeftShift(n => {
                if (n > -(todoLists.length - numberOfLists - numberOfLists)) {
                    return n - numberOfLists
                } else {
                    return -(todoLists.length - numberOfLists)
                }
            })
        },
        target: (i: number) => () => {
            setLeftShift(n => {
                if (i < numberOfLists)
                    return 0;
                if (i > - (todoLists.length - numberOfLists))
                    return - (todoLists.length - numberOfLists);
                return i;
            })
        },
        makeSpaceForNewList: () => {
            setLeftShift(todoLists.length < 5 ? 0 : - (todoLists.length - 4))
        }
    }
    const showLeftButtons = React.useMemo(() => leftShift !== 0, [leftShift]);
    const showRightButtons = React.useMemo(() => {
        if (todoLists.length <= numberOfLists)
            return false;

        return leftShift !== -(todoLists.length - numberOfLists);
    }, [leftShift, numberOfLists, todoLists.length]);

    return { leftShift, move, showLeftButtons, showRightButtons };
}

export default useMoveCustomLists