import SongCard from "components/card/SongCard";
import {useTheme} from "@mui/material";
import {useDispatch, useSelector} from "store";
import {sendGAEvent} from "@next/third-parties/google";
import {AppActions} from "store/slices/AppSlice";

export default function SongList(props) {
    const { songs } = props;
    const dispatch = useDispatch();
    const { currentPlay } = useSelector(state => state.app);

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

    return songs?.map((e, i) => (
        <SongCard
            key={i}
            image={e.album?.image}
            title={e.title}
            subtitle={`${e.album?.title} - ${e.artist?.name}`}
            onClick={() => handlePlay(e, i)}/>
    ))
}
