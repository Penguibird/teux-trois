import styled from '@emotion/styled';
import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import useOutsideAlerter from '../../hooks/useOutsideAlerter';


interface dropdownOpenState {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>> | null;
    openedByClick: boolean;
    setOpenedByClick: React.Dispatch<React.SetStateAction<boolean>> | null;
}
const DropdownOpen = React.createContext<dropdownOpenState>({
    open: false,
    setOpen: null,
    openedByClick: false,
    setOpenedByClick: null,
});

interface DropDownWrapperProps extends Partial<React.PropsWithChildren<React.ReactHTMLElement<HTMLDivElement>>> {

};

const DropDownContainer = styled.div`
    position: relative;
    `
const DropDownWrapper: React.FC<DropDownWrapperProps> = ({ children, ...props }) => {
    const [open, setOpen] = React.useState(false);
    const [openedByClick, setOpenedByClick] = React.useState(false)

    const memoizedState = React.useMemo(() => ({ open, setOpen, openedByClick, setOpenedByClick }), [open, openedByClick])

    const ref = React.useRef(null)

    useOutsideAlerter(ref, () => {
        setOpen(false);
    })

    const onMouseLeave = () => {
        if (!openedByClick) setOpen(false)
    }

    React.useEffect(() => {
        if (!open)
            setOpenedByClick(false)
    }, [open])

    return <DropdownOpen.Provider value={memoizedState}>
        <DropDownContainer ref={ref} onMouseLeave={onMouseLeave}>
            {children}
        </DropDownContainer>
    </DropdownOpen.Provider>
}


interface DropDownToggleProps extends Partial<React.ComponentPropsWithoutRef<"div">> {
};

const Toggle = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
`

const DropDownToggle: React.FC<DropDownToggleProps> = ({ children, ...props }) => {
    const { setOpen, setOpenedByClick } = React.useContext(DropdownOpen);
    if (!setOpen || !setOpenedByClick)
        return <div />

    return <Toggle
        {...props}
        className={props.className}
        onMouseEnter={() => setOpen(true)}
        onClick={() => {
            // console.log("clicked")
            setOpen(true);
            setOpenedByClick(true);
        }}
    >
        {children}
        <svg id="dropdown-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    </Toggle>
}

const Menu = styled.nav`
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    position: absolute;
`

interface DropDownMenuProps extends Partial<React.PropsWithChildren<React.ReactHTMLElement<HTMLDivElement>>> {
};

const DropDownMenu: React.FC<DropDownMenuProps> = ({ children, ...props }) => {
    const { open } = React.useContext(DropdownOpen);
    if (!open) {
        return null;
    }

    return <Menu {...props}>
        {children}
    </Menu>
}

const Dropdown = {
    Wrapper: DropDownWrapper,
    Toggle: DropDownToggle,
    Menu: DropDownMenu
}

export default Dropdown;