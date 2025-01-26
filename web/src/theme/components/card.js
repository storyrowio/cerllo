const CardTheme = () => {
    return {
        MuiCard: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: 12,
                    // boxShadow: CardShadow,
                    '& .card-more-options': {
                        marginTop: theme.spacing(-1),
                        marginRight: theme.spacing(-3)
                    }
                })
            }
        }
    }
};

export default CardTheme;
