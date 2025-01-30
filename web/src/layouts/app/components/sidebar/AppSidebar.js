import {
    Box, Button,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText, ListSubheader,
    styled, Typography,
    useTheme
} from "@mui/material";
import {useDispatch, useSelector} from "store";
import {DefaultAppMenus} from "constants/menus";
import {useRouter} from "next/navigation";
import {Add01Icon} from "hugeicons-react";
import {HexToRGBA} from "utils/theme";
import {AppActions} from "store/slices/AppSlice";
import {GenerateUniqueId} from "utils/helper";
import Divider from "@mui/material/Divider";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 0.5, 0, 2),
    ...theme.mixins.toolbar,
    justifyContent: 'space-between',
}));

const DrawerMenuList = styled(List)(({theme}) => ({
    overflowY: 'auto'
}));

const Item = styled(ListItem)(({theme}) => ({
    padding: theme.spacing(0, 1.5),
}));

const ItemText = styled(ListItemText)(({theme}) => ({
    '& .MuiTypography-root': {
        fontSize: 13.125
    }
}));

const ItemButton = styled(ListItemButton)(({theme}) => ({
    padding: theme.spacing(0.75, 0),
    background: 'transparent',
    color: theme.palette.text.primary,
    borderRadius: 10,
    '& svg': {
        color: theme.palette.text.primary
    }
}));

export default function AppSidebar() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const router = useRouter();
    const { drawerWidth } = useSelector(state => state.theme);
    const { isAuthed, playlists } = useSelector(state => state.app);
    const handleMenu = (item) => {
        router.push(`${item.href}`);
    };

    return (
        <Drawer
            open={true}
            variant="persistent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                zIndex: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    backgroundColor: theme.palette.background.default,
                    boxSizing: 'border-box',
                    border: 'none'
                },
            }}>
            <Box height={50}/>
            <DrawerMenuList>
                {DefaultAppMenus.map((item, i) => {
                    const Icon = item.icon;

                    if (item.sectionTitle) {
                        return (
                            <ListSubheader
                                key={i}
                                sx={{
                                    height: 35,
                                    px: 3,
                                    lineHeight: '30px',
                                    backgroundColor: theme.palette.background.default,

                                    '& .MuiTypography-root, & svg': {
                                        color: 'text.secondary',
                                        fontStyle: 'italic',
                                        letterSpacing: 1.5,
                                    }
                                }}>
                                <Typography noWrap variant='caption' sx={{ textTransform: 'uppercase' }}>
                                    {item.sectionTitle}
                                </Typography>
                            </ListSubheader>
                        )
                    }

                    return (
                        <Item
                            key={item.id}
                            sx={{
                                paddingY: 0,
                            }}
                            onClick={() => handleMenu(item)}>
                            <ItemButton
                                sx={{
                                    paddingX: 1.5,
                                    '&:hover': {
                                        background: theme.palette.background.paper
                                    }
                                }}>
                                <ListItemIcon sx={{ minWidth: 30 }}>
                                    {item.icon && <Icon color={theme.palette.text.primary} width={18} height={18}/>}
                                </ListItemIcon>
                                <ItemText primary={item.title}/>
                            </ItemButton>
                        </Item>
                    )
                })}
                {isAuthed ? (
                    <Item>
                        <Button
                            fullWidth
                            sx={{ background: HexToRGBA(theme.palette.text.primary, 0.08)}}
                            size="small"
                            color="text"
                            startIcon={<Add01Icon/>}
                            onClick={() => dispatch(AppActions.setPlaylistForm(true))}>
                            Add Playlist
                        </Button>
                    </Item>
                ) : (
                    <Box sx={{ padding: 2 }}>
                        <Button
                            fullWidth
                            onClick={() => router.push('/login')}>
                            Sign In
                        </Button>
                    </Box>
                )}
                <Box height={10}/>
                {playlists?.map((item, i) => (
                    <Item
                        key={item.id}
                        sx={{
                            paddingY: 0,
                        }}
                        onClick={() => {
                            // dispatch(AppActions.setCurrentPlaylist({id: item.id}));
                            router.push(`/playlist/${item.id}`)
                        }}>
                        <ItemButton
                            sx={{
                                paddingX: 1.5,
                                '&:hover': {
                                    background: theme.palette.background.paper
                                }
                            }}>
                            <ItemText primary={item.name}/>
                        </ItemButton>
                    </Item>
                ))}
            </DrawerMenuList>
        </Drawer>
    )
}
