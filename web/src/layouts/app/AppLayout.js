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
import AuthService from "services/AuthService";
import PlaylistService from "services/PlaylistService";

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
    const { songs } = useSelector(state => state.app);

    const fetchPlaylist = async (userId) => {
        return PlaylistService.GetPlaylistByQuery({user: userId})
            .then(res => {
                dispatch(AppActions.setPlaylists(res?.data))
            });
    }

    const fetchInitial = () => {
        return AuthService.GetProfile()
            .then(async res => {
                if (res?.id) {
                    fetchPlaylist(res?.id);
                }
            }).catch(async err => {
                console.log('Error', err)
                await AuthService.RefreshToken()
                    .then(() => {
                        fetchInitial();
                    })
            })
    };

    useEffect(() => {
        fetchInitial();
    }, []);

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
