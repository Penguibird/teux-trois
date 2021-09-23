import React from "react";

const breakpointInPx = 768 as const;

export const useNumberOfListsInRowQuery = ({ callback }: { callback?: (e: MediaQueryListEvent | MediaQueryList) => void }) => {
    const [number, setNumber] = React.useState(5);

    const eventHandler = React.useCallback((e: MediaQueryListEvent | MediaQueryList) => {
        if (callback)
            callback(e)
        if (e.matches) {
            setNumber(5);
        } else {
            setNumber(1)
        }
    }, [callback])

    React.useEffect(() => {
        if (!window) {
            console.error("Cant run media query in SSR environments, using default value for number of lists in a row")
            return;
        }
        const query = window.matchMedia(`(min-width: ${breakpointInPx}px)`)
        eventHandler(query);
        query.addEventListener("change", eventHandler)
        return () => query.removeEventListener("change", eventHandler)
    }, [eventHandler])


    return number;
}