import {Button, Dialog, DialogActions, DialogContent, FormLabel, TextField} from "@mui/material";
import {useDispatch, useSelector} from "store";
import {AppActions} from "store/slices/AppSlice";
import {useFormik} from "formik";
import PlaylistService from "services/PlaylistService";

export default function PlaylistFormDialog() {
    const dispatch = useDispatch();
    const { playlistForm } = useSelector(state => state.app);

    const formik = useFormik({
        initialValues: {name: ''},
        onSubmit: values => handleSubmit(values)
    });

    const handleSubmit = (values) => {
        return PlaylistService.CreatePlaylist(values)
            .then(res => {
                formik.resetForm();
                dispatch(AppActions.setPlaylistForm(false));
                dispatch(AppActions.setPlaylists(res));
            })
    };

    return (
        <Dialog
            open={playlistForm}
            onClose={() => dispatch(AppActions.setPlaylistForm(false))}>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent>
                    <FormLabel>Name</FormLabel>
                    <TextField
                        fullWidth
                        name="name"
                        onChange={formik.handleChange}
                        value={formik.values.name}/>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => dispatch(AppActions.setPlaylistForm(false))}
                        sx={{ color: 'grey'}}>Cancel</Button>
                    <Button type="submit" autoFocus>
                        Submit
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
