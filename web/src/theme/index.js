import {createTheme, ThemeProvider} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import palette from "theme/palette";
import shadows from "theme/shadows";
import components from "theme/components";
import typography from "theme/typography";

export default function Theme({ children }) {
    const options = {
        palette: palette,
        components: components(),
        shadows: shadows(),
        typography: typography()
    }
    const theme = createTheme(options)

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            {children}
        </ThemeProvider>
    )
}
