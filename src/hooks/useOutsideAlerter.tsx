import React, { useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref: React.RefObject<HTMLInputElement> | React.MutableRefObject<HTMLElement | undefined>, callback: () => void) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: any) {
            // console.log(event, ref)
            if (ref.current && !ref.current.contains(event.target)) {
                callback()
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback]);
}

export default useOutsideAlerter