
/** @jsxRuntime classic /
/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import useOutsideAlerter from '../../../hooks/useOutsideAlerter';
import { SerializedStyles } from '@emotion/react';
import { StyledInputCss } from '../../../components-style/styledInput';


interface InputProps {
    defaultValue?: string,
    onTypingChange: (editing: boolean) => void,
    onTextChange: (text: string) => void,
    css?: SerializedStyles,
};


const Input: React.FC<InputProps> = ({ css = StyledInputCss, defaultValue = "", onTypingChange, onTextChange, ...props }) => {

    const [value, setValue] = React.useState<string>(defaultValue)

    const inputRef = React.useRef<HTMLInputElement>(null);


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

    return <input
        css={css}
        {...props}
        ref={inputRef}
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
