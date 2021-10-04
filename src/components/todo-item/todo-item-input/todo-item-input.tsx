
/** @jsxRuntime classic /
/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
//import {Fragment, useState, useEffect} from 'react';
import { SerializedStyles } from '@emotion/react';
import { StyledInputCss } from '../../../components-style/styledInput';


interface InputProps {
    defaultValue?: string,
    onTypingChange: (editing: boolean) => void,
    removeTodo: () => void
    onTextChange: (text: string) => void,
    css?: SerializedStyles,
};


const Input: React.FC<InputProps> = ({ css = StyledInputCss, defaultValue = "", onTypingChange, onTextChange, removeTodo, ...props }) => {

    const [text, setText] = React.useState<string>(defaultValue)
    const inputRef = React.useRef<HTMLInputElement>(null);


    React.useEffect(() => {
        inputRef.current?.focus();
    }, [inputRef])

    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setText(defaultValue);
                inputRef.current?.blur();

                // if (onCancel) onCancel();
            }
        }
        window.addEventListener('keydown', handler)
        return () => {
            window.removeEventListener('keydown', handler)
        }
    }, [defaultValue])

    const closeInput = () => {
        if (text === "") {
            removeTodo()
        } else {
            onTextChange(text);
        }
        onTypingChange(false);
    }

    return <React.Fragment>

        <input
            css={css}
            {...props}
            ref={inputRef}
            onBlur={closeInput}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            value={text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setText(e.target.value) }}
            onKeyPress={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') { closeInput() }
            }}
        />
    </React.Fragment>
}


export default Input;
