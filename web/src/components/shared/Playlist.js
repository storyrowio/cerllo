import {
    Box,
    Container,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, useTheme
} from "@mui/material";
import {Add01Icon, AddCircleIcon, PauseIcon, PlayIcon} from "hugeicons-react";
import {AppActions} from "store/slices/AppSlice";
import {useDispatch, useSelector} from "store";
import { sendGAEvent } from '@next/third-parties/google'
import {useState} from "react";
import AddToPlaylistForm from "components/pages/playlist/AddToPlaylistForm";
import PlaylistService from "services/PlaylistService";

export default function Playlist(props) {
    const { songs } = props;
    const theme = useTheme();
    const dispatch = useDispatch();
    const { currentPlay } = useSelector(state => state.app);
    const [addToPlaylist, setAddToPlaylist] = useState({open: false, songId: null});

    const handlePlay = (song, index) => {
        sendGAEvent('event', 'buttonClicked', { value: 'PlayFromList' })
        dispatch(AppActions.setCurrentPlay({song, index, isPlaying: false}));
        setTimeout(() => {
            if (currentPlay.song === song && currentPlay.isPlaying) {
                dispatch(AppActions.setIsPlaying(false));
            } else {
                dispatch(AppActions.setIsPlaying(true));
            }
        }, 500);
    };

    const handleAddSongToPlaylist = (playlistId) => {
        return PlaylistService.AddSongToPlaylist({
            playlistId,
            songId: addToPlaylist.songId,
        }).then(() => {
            setAddToPlaylist({open: false, songId: null});
        })
    };

    return (
        <Box sx={{ width: '100%' }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Artist</TableCell>
                            <TableCell>Option</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {songs?.map((e, i) => (
                            <TableRow key={i}>
                                <TableCell>{i + 1}</TableCell>
                                <TableCell>{e.title}</TableCell>
                                <TableCell>{e.artist?.name}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handlePlay(e, i)}>
                                        {currentPlay.song?.title === e.title && currentPlay.isPlaying ?
                                            <PauseIcon color={theme.palette.text.primary}/> : <PlayIcon color={theme.palette.text.primary}/>}
                                    </IconButton>
                                    <IconButton onClick={() => setAddToPlaylist({open: true, songId: e.id})}>
                                        <AddCircleIcon color={theme.palette.text.primary}/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AddToPlaylistForm
                open={addToPlaylist.open}
                onClose={() => setAddToPlaylist({open: false, songId: null})}
                onSubmit={handleAddSongToPlaylist}/>
        </Box>
    )
}
