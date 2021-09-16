import { createPortal } from 'react-dom';
import React from 'react'

const useOptionalPortal = (defaultKey: string = "") => {

    const portalLocation = React.useRef<HTMLElement>();

    React.useEffect(() => {
        if (document.getElementById('draggable')) {
            portalLocation.current = document.getElementById('draggable')!;
        }
    }, [])

    const portalize = (bool: boolean, children: React.ReactNode, key = defaultKey) => {
        if (bool) {
            if (portalLocation.current) {
                return createPortal(children, portalLocation.current, key)
            } else {
                console.warn("Unable to create portal in component todo item id:", key)
                return children
            }
        } else {
            return children;
        }
    }

    return portalize;
}

export default useOptionalPortal;