const InputTheme = () => {
    return {
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    fontSize: 11,
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    background: theme.palette.background.paper,
                    borderRadius: '10px',
                    '&:not(.MuiInputBase-sizeSmall)': {
                        borderRadius: 8
                    },
                    '&:hover:not(.Mui-focused):not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline': {
                        borderColor: `rgba(${theme.palette.background.paper}, 0.28)`
                    },
                    '&:hover.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.error.main
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: `rgba(${theme.palette.background.paper}, 0.2)`
                    },
                    '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.text.disabled
                    },
                    '&.Mui-focused': {
                        boxShadow: theme.shadows[2]
                    },
                    '& .MuiInputBase-inputMultiline': {
                        padding: '0 !important'
                    }
                }),
                sizeSmall: {
                    height: 38,
                    borderRadius: '8px'
                },
                input: {
                    padding: '10px 15px !important',
                    fontSize: 13.125,
                },
            }
        },
    }
};

export default InputTheme;
