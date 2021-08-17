const compareObjects = (paramsArray: string[]) => (prevProps: Readonly<React.PropsWithChildren<any>>, nextProps: Readonly<React.PropsWithChildren<any>>): boolean => {

    return paramsArray.reduce((acc: boolean, val: string, i: number, arr: string[]) => {
        return acc && (prevProps[val] === nextProps[val])
    }, true)
}

export default compareObjects