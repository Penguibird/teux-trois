import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import styled from '@emotion/styled'
import useOutsideAlerter from '../../hooks/useOutsideAlerter';
import { cleanup } from '@testing-library/react';

interface InputProps {
    defaultValue: string,
    setEditing: (editing: boolean) => void,
    setText: (text: string) => void,

    // myRef?: React.MutableRefObject<HTMLInputElement>,
};

const StyledInput = styled((props: any) => <input ref={props.myRef} {...props} />)`
    padding: 0;
    margin: 0;
    border: none;
    outline: none !important;
    width: 100%;

`

const Input: React.FC<InputProps> = ({ defaultValue, setEditing, setText, ...props }) => {

    const [value, setValue] = React.useState<string>(defaultValue)

    const inputRef = React.useRef<HTMLInputElement>();


    React.useEffect(() => {
        inputRef.current?.focus();
    }, [inputRef])


    useOutsideAlerter(inputRef, () => {
        // inputRef.current?.setSelectionRange(0, 0);
        closeInput();
    }); 

    const closeInput = () => {
        setText(value);
        setEditing(false);
    }

    return <StyledInput
        {...props}
        myRef={inputRef}
        onClick={(e: MouseEvent) => e.stopPropagation()}

        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setValue(e.target.value) }}

        onKeyPress={(e: KeyboardEvent) => {
            console.log(e)
            if (e.key === 'Enter') { closeInput() }
        }}
    />
}

export default Input;
