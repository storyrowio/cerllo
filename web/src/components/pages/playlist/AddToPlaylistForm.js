import {useSelector} from "store";
import {Button, Dialog, DialogContent, DialogTitle, Stack} from "@mui/material";

export default function AddToPlaylistForm({ open, onClose, onSubmit }) {
    const { playlists } = useSelector(state => state.app);

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            onClose={onClose}>
            <DialogTitle>Select Playlist</DialogTitle>
            <DialogContent>
                <Stack spacing={2}>
                    {playlists?.map((e, i) => (
                        <Button
                            key={i}
                            fullWidth
                            onClick={() => onSubmit(e.id)}>
                            {e.name}
                        </Button>
                    ))}
                </Stack>
            </DialogContent>
        </Dialog>
    )
}
