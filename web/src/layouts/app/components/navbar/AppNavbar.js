import {Box, styled, TextField, Toolbar} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import AppProfileMenu from "layouts/app/components/navbar/AppProfileMenu";
import Logo from "components/shared/Logo";

const AppBar = styled(MuiAppBar)((({ theme, open, appNavbarHeight, drawerWidth }) => {
    return {
        height: `${appNavbarHeight}px`,
        background: 'transparent',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        })
    }
}));

export default function AppNavbar() {
    return (
        <AppBar
            elevation={0}
            position="fixed"
            appNavbarHeight={50}
            drawerWidth={220}>
            <Toolbar sx={{ minHeight: `${50}px !important`, justifyContent: "space-between", alignItems: "center" }}>
                <Logo width={40}/>
                <Box sx={{ flexGrow: 0.5 }}>
                    <TextField
                        fullWidth
                        placeholder="Search song ..."/>
                </Box>
                <AppProfileMenu/>
            </Toolbar>
        </AppBar>
    )
}
