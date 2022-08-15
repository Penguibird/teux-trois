/** @jsxRuntime classic /
/** @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
import { SerializedStyles } from '@emotion/react';
// import styled from '@emotion/styled';
import { StyledInputCss } from '../../components-style/styledInput';

interface AddTodoItemProps {
    addNewItem: (t: string) => void
    onCancel?: () => void
    css?: SerializedStyles
    ref?: any;
    focusOnRender?: boolean
};

const AddTodoItem: React.FC<AddTodoItemProps> = React.forwardRef(({ focusOnRender, css = StyledInputCss, addNewItem, onCancel }, forwardedRef: React.ForwardedRef<HTMLInputElement>) => {
    const myRef = React.useRef<HTMLInputElement>(null);
    const inputRef = forwardedRef as React.MutableRefObject<HTMLInputElement> || myRef;

    const [text, setText] = React.useState<string>('');

    const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
    }, [])

    React.useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setText('');
                inputRef.current?.blur();

                if (onCancel) onCancel();
            }
        }
        window.addEventListener('keydown', handler)
        return () => {
            window.removeEventListener('keydown', handler)
        }
    }, [onCancel, inputRef])

    React.useLayoutEffect(() => {
        if (focusOnRender) inputRef.current?.focus();
    }, [focusOnRender, inputRef])


    const closeInput = React.useCallback(() => {
        if (text === "") {
            if (onCancel) onCancel();
            return;
        }
        setText('')
        addNewItem(text)


    }, [addNewItem, onCancel, text])


    return <React.Fragment>

        <input
            //@ts-ignore
            css={css}
            ref={inputRef}
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
)
export default AddTodoItem;
