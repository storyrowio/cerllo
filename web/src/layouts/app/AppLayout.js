import {Box, styled} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import AppNavbar from "layouts/app/components/navbar/AppNavbar";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import AppStorage from "utils/storage";
import {AUTH_TOKEN} from "constants/storage";
import {useDispatch, useSelector} from "store";
import {AppActions} from "store/slices/AppSlice";
import AppSidebar from "layouts/app/components/sidebar/AppSidebar";
import Player from "components/shared/Player";
import PlaylistFormDialog from "components/pages/playlist/PlaylistFormDialog";

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' && prop !== 'drawerWidth' })(
    ({ theme, drawerWidth }) => ({
        minHeight: '100vh',
        flexGrow: 1,
        position: 'relative',
        overflowY: 'hidden',
        right: 0,
        // background: theme.palette.text.secondary,
        background: theme.palette.background.default,
        padding: theme.spacing(0.5, 2, 0, 2),
    }),
);

export default function AppLayout({ children }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const { drawerWidth } = useSelector(state => state.theme);
    const { songs, playlists } = useSelector(state => state.app);

    useEffect(() => {
        if (token) {
            AppStorage.SetItem(AUTH_TOKEN, token);
            router.push('/');
        }
    }, [token]);

    useEffect(() => {
        const appToken = AppStorage.GetItem(AUTH_TOKEN);
        if (appToken) {
            dispatch(AppActions.setIsAuthed(true));
        }
    }, []);

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppNavbar/>
            <AppSidebar/>
            <Main drawerWidth={drawerWidth}>
                <Box sx={{ height: 80 }}/>
                {children}
                <Box height={140}/>
            </Main>
            <Player songs={songs ?? []}/>
            <PlaylistFormDialog/>
        </Box>
    )
}
