import React, { useRef } from "react";

const breakpointInPx = 768 as const;

const NumberOfListsContext = React.createContext<number>(5);

export const NumberOfListsContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [number, setNumber] = React.useState(5);

    const callback = React.useCallback((e: MediaQueryListEvent) => {
        if (e.matches) {
            setNumber(5);
        } else {
            setNumber(1)
        }
    }, [])

    React.useEffect(() => {
        if (!window) {
            console.error("Cant run media query in SSR environments, using default value for number of lists in a row")
            return;
        }
        const query = window.matchMedia(`min-width: ${breakpointInPx}px`)

        query.addEventListener("change", callback)
        return query.removeEventListener("change", callback)
    }, [callback])

    const memoizedNumber = React.useMemo(() => number, [number])

    return <NumberOfListsContext.Provider value={memoizedNumber}>
        {children}
    </NumberOfListsContext.Provider>
}

export const useNumberOfListsInRowQuery = () => {
    const n = React.useContext(NumberOfListsContext);

    if (!n) {
        console.error("Cannot use NumberOfListsInRowQuery context before initialization or outside provider");
    }

    return n;
}