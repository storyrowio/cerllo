const TableTheme = () => {
    return {
        MuiTableContainer: {
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: 12,
                    border: `1px solid ${theme.palette.divider}`
                })
            }
        },
        MuiTableRow: {
            styleOverrides: {
                root: () => ({
                    '&:last-child td': {
                        borderBottom: 'none'
                    }
                })
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: ({ theme }) => ({
                    padding: theme.spacing(1.75, 2),
                    fontSize: 14,
                    borderBottom: `1px solid ${theme.palette.divider}`
                }),
                paddingCheckbox: ({ theme }) => ({
                    paddingLeft: theme.spacing(3.25)
                }),
                head: ({ theme }) => ({
                    fontSize: 12,
                    color: theme.palette.text.secondary,
                    padding: theme.spacing(1.25, 2),
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                })
            }
        }
    }
};

export default TableTheme;
