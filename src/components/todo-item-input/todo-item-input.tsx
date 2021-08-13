import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import styled, { StyledComponent } from '@emotion/styled'
import useOutsideAlerter from '../../hooks/useOutsideAlerter';
import { cleanup } from '@testing-library/react';

interface InputProps {
    defaultValue?: string,
    onTypingChange: (editing: boolean) => void,
    onTextChange: (text: string) => void,

    // myRef?: React.MutableRefObject<HTMLInputElement>,
};

interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    myRef?: React.MutableRefObject<HTMLInputElement | undefined>
}
export const StyledInput: StyledComponent<StyledInputProps> = styled((props: any) => <input ref={props.myRef} {...props} />)`
    padding: 0;
    margin: 0;
    border: none;
    outline: none !important;
    width: 100%;

`

const Input: React.FC<InputProps> = ({ defaultValue = "", onTypingChange, onTextChange, ...props }) => {

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
        onTextChange(value);
        onTypingChange(false);
    }

    return <StyledInput
        {...props}
        myRef={inputRef}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}

        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setValue(e.target.value) }}

        onKeyPress={(e: React.KeyboardEvent) => {
            console.log(e)
            if (e.key === 'Enter') { closeInput() }
        }}
    />
}

export default Input;
