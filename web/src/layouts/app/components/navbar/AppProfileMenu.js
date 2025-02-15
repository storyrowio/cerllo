import {Avatar, Menu, MenuItem, Tooltip} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {useState} from "react";
import ProfileAvatar from "components/shared/ProfileAvatar";
import CustomIconButton from "components/button/CustomIconButton";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "store";
import AuthService from "services/AuthService";
import {AppActions} from "store/slices/AppSlice";

const settings = ['Profile', 'Account', 'Dashboard'];

export default function AppProfileMenu(props) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isAuthed } = useSelector(state => state.app);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event) => {
        if (isAuthed) {
            setAnchorElUser(event.currentTarget);
        } else {
            router.push('/login');
        }
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logout = () => {
        setAnchorElUser(null);
        dispatch(AppActions.setIsAuthed(false));
        dispatch(AppActions.reset());
        router.push('/');

        return AuthService.Logout()
    };

    return (
        <>
            <Tooltip title="Open settings">
                <CustomIconButton onClick={handleOpenUserMenu} sx={{ width: 38, height: 38 }}>
                    <ProfileAvatar/>
                </CustomIconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
                {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                    </MenuItem>
                ))}
                <MenuItem onClick={logout}>
                    <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
                </MenuItem>
            </Menu>
        </>
    )
}
