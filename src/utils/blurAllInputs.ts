const blurAllInputs = () => {
    for (const node of document.querySelectorAll('input:focus')) {
        (node as HTMLInputElement).blur();
    }
}

export default blurAllInputs