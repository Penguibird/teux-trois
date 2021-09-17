
import * as React from 'react';
import type { TodoList } from '../../../types/TodoList';

const useMoveCustomLists = (todoLists: TodoList[]) => {
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
                if (n > 5) {
                    return n + 5
                } else {
                    return 0
                }
            })
        },
        fiveRight: () => {
            setLeftShift(n => {
                if (n > -(todoLists.length - 5 - 5)) {
                    return n - 5
                } else {
                    return -(todoLists.length - 5)
                }
            })
        },
        target: (i: number) => () => {
            setLeftShift(n => {
                if (i < 5)
                    return 0;
                if (i > - (todoLists.length - 5))
                    return - (todoLists.length - 5);
                return i;
            })
        },
        makeSpaceForNewList: () => {
            setLeftShift(- (todoLists.length - 4))
        }
    }
    const showLeftButtons = React.useMemo(() => leftShift !== 0, [leftShift]);
    const showRightButtons = React.useMemo(() => {
        if (todoLists.length <= 5)
            return false;

        return leftShift !== -(todoLists.length - 5);
    }, [leftShift, todoLists.length]);

    return { leftShift, move, showLeftButtons, showRightButtons };
}

export default useMoveCustomLists