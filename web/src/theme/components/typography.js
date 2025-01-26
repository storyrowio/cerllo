const TypographyTheme = () => {
    return {
        MuiTypography: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.palette.text.primary,
                })
            }
        }
    }
};

export default TypographyTheme;
