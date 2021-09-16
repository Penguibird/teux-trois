/** @jsxRuntime classic /
/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
import { SerializedStyles } from '@emotion/react';
// import styled from '@emotion/styled';
import { StyledInputCss } from './../../components-style/styledInput';

interface AddTodoItemProps {
    addNewItem: (t: string) => void
    onCancel?: () => void
    css?: SerializedStyles
    focusOnRender?: boolean
};

const AddTodoItem: React.FC<AddTodoItemProps> = ({ focusOnRender, css = StyledInputCss, addNewItem, onCancel }) => {
    const ref = React.useRef<HTMLInputElement>(null);


    const [text, setText] = React.useState<string>('');

    const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
    }, [])

    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setText('');
                ref.current?.blur();

                if (onCancel) onCancel();
            }
        }
        window.addEventListener('keydown', handler)
        return () => {
            window.removeEventListener('keydown', handler)
        }
    }, [onCancel])

    React.useLayoutEffect(() => {
        if (focusOnRender) ref.current?.focus();
    }, [focusOnRender])


    const closeInput = React.useCallback(() => {
        if (text === "") return;
        setText('')
        addNewItem(text)
    }, [addNewItem, text])


    return <React.Fragment>

        <input
            //@ts-ignore
            css={css}
            ref={ref}
            value={text}
            onBlur={closeInput}
            onChange={onChange}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            onKeyPress={(e: React.KeyboardEvent) => {
                if (e.key === 'Enter') { closeInput() }
            }}
        />
    </React.Fragment>
}

export default AddTodoItem;
