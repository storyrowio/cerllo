'use client'

import {useEffect, useRef, useState} from "react";
import {
    NextIcon,
    PauseIcon,
    PlayIcon,
    PreviousIcon, RepeatOne01Icon, RepeatIcon,
    VolumeHighIcon,
    VolumeLowIcon,
    VolumeMute02Icon
} from "hugeicons-react";
import {
    Box,
    Card,
    CardContent,
    IconButton,
    Slider,
    Stack,
    styled,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {useDispatch, useSelector} from "store";
import {AppActions} from "store/slices/AppSlice";
import {sendGAEvent, sendGTMEvent} from "@next/third-parties/google";

const PlayerWrapper = styled(Box)(({theme}) => ({
    width: '100%',
    position: 'fixed',
    bottom: 1
}));

const PlayerCard = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3, 5),
    background: theme.palette.background.paper
}));

export default function Player({ songs }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const mobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    const { currentPlay, isPlaying } = useSelector(state => state.app);

    // const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentPercentage, setCurrentPercentage] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [playlistSetting, setPlaylistSetting] = useState('repeat');

    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = volume;
    }, []);

    useEffect(() => {
        if (currentPlay.isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [currentPlay.isPlaying]);

    const formatTime = (time) => {
        const totalSeconds = Math.floor(time);

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handlePlay = () => {
        audioRef.current.play();
        dispatch(AppActions.setIsPlaying(true));
    }

    const handlePause = () => {
        audioRef.current.pause();
        dispatch(AppActions.setIsPlaying(false));
    };

    const handlePlayPause = () => {
        if (audioRef.current.paused) {
            sendGTMEvent({ event: 'buttonClicked', value: 'PlayFromPlayer' })
            sendGAEvent('event', 'buttonClicked', { value: 'PlayFromPlayer' })
            audioRef.current.play();
            dispatch(AppActions.setIsPlaying(true));
        } else {
            sendGTMEvent({ event: 'buttonClicked', value: 'PauseFromPlayer' })
            sendGAEvent('event', 'buttonClicked', { value: 'PauseFromPlayer' })
            audioRef.current.pause();
            dispatch(AppActions.setIsPlaying(false));
        }
    };

    const handleTimeUpdate = () => {
        const percentage = (audioRef.current.currentTime/audioRef.current.duration) * 100;
        setCurrentPercentage(percentage);
        setDuration(audioRef.current.duration);
        setCurrentTime(audioRef.current.currentTime);

        if (audioRef.current.currentTime === audioRef.current.duration) {
            setTimeout(() => {
                handleNextPrev(currentPlay.index + 1);
            }, 500);
        }
    };

    const handleVolumeChange = (val) => {
        const volumeValue = val/100;
        setVolume(volumeValue);
        audioRef.current.volume = volumeValue;
    };

    const handleSeek = (newTime) => {
        if (newTime <= 100) {
            const timeValue = (newTime/100) * duration;
            audioRef.current.currentTime = timeValue;
            setCurrentTime(timeValue);
            setCurrentPercentage(newTime);
        }
    };

    const VolumeIcon = () => {
        if (volume === 0) return <VolumeMute02Icon size={20} color={theme.palette.text.primary}/>;
        if (volume < 0.5) return <VolumeLowIcon size={20} color={theme.palette.text.primary}/>;
        return <VolumeHighIcon size={20} color={theme.palette.text.primary}/>;
    };

    const PlayListSettingIcon = () => {
        if (playlistSetting === 'repeatOne') return <RepeatOne01Icon size={18} color={theme.palette.primary.main}/>
        if (playlistSetting === 'repeat') return <RepeatIcon size={18} color={theme.palette.primary.main}/>
        return <RepeatIcon size={18} color={theme.palette.text.primary}/>
    };

    const handleNextPrev = (index) => {
        handlePause();
        setCurrentPercentage(0);

        if (index <= (songs.length - 1)) {
            sendGTMEvent({ event: 'buttonClicked', value: 'NextPrevFromPlayer' })
            sendGAEvent('event', 'buttonClicked', { value: 'NextPrevFromPlayer' })
            dispatch(AppActions.setCurrentPlay({song: songs[index], index: index}))
        } else {
            if (playlistSetting === 'repeat') {
                dispatch(AppActions.setCurrentPlay({song: songs[0], index: 0}))
            }
        }

        setTimeout(() => {
            handlePlay();
        }, 500);
    };

    const handleRepeat = () => {
        if (playlistSetting === 'repeat') setPlaylistSetting('repeatOne');
        if (playlistSetting === 'repeatOne') setPlaylistSetting('oneTime');
        if (playlistSetting === 'oneTime') setPlaylistSetting('repeat');
    };

    return (
        <PlayerWrapper>
            <PlayerCard>
                <audio
                    ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={event => setDuration(event.target.duration)}
                    src={currentPlay.song.url}
                />

                <Stack direction={mobile ? 'column' : 'row'} justifyContent="space-between">
                    <Stack justifyContent="center" spacing={1} flex={0.25}>
                        <Typography variant="h5" sx={{fontWeight: 700}}>{currentPlay.song.title}</Typography>
                        <Typography>{currentPlay.song.artist?.name}</Typography>
                    </Stack>

                    <Stack flex={0.5} alignItems="center" spacing={1}>
                        <Stack direction="row" alignItems="center" spacing={4}>
                            <IconButton disabled={currentPlay.index === null} size="small"
                                        onClick={() => handleNextPrev(currentPlay.index - 1)}>
                                <PreviousIcon size={20} color={theme.palette.text.primary}/>
                            </IconButton>
                            <IconButton disabled={currentPlay.index === null} onClick={handlePlayPause}>
                                {currentPlay.isPlaying ? <PauseIcon size={30} color={theme.palette.text.primary}/> :
                                    <PlayIcon size={30} color={theme.palette.text.primary}/>}
                            </IconButton>
                            <IconButton disabled={currentPlay.index === null} size="small"
                                        onClick={() => handleNextPrev(currentPlay.index + 1)}>
                                <NextIcon size={20} color={theme.palette.text.primary}/>
                            </IconButton>
                        </Stack>
                        <Stack
                            sx={{width: '100%'}}
                            direction="row"
                            alignItems="center"
                            spacing={3}>
                            <Typography variant="caption" sx={{minWidth: 25}}>{formatTime(currentTime)}</Typography>
                            <Slider
                                value={currentPercentage}
                                onChange={(e, val) => handleSeek(val)}
                                sx={(t) => ({
                                    color: theme.palette.text.secondary,
                                    height: 4,
                                    '& .MuiSlider-thumb': {
                                        width: 8,
                                        height: 8,
                                        transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                                        '&::before': {
                                            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                                        },
                                        '&:hover, &.Mui-focusVisible': {
                                            boxShadow: `0px 0px 0px 8px ${'rgb(0 0 0 / 16%)'}`,
                                            ...t.applyStyles('dark', {
                                                boxShadow: `0px 0px 0px 8px ${'rgb(255 255 255 / 16%)'}`,
                                            }),
                                        },
                                        '&.Mui-active': {
                                            width: 20,
                                            height: 20,
                                        },
                                    },
                                    '& .MuiSlider-rail': {
                                        opacity: 0.28,
                                    },
                                    ...t.applyStyles('dark', {
                                        color: '#fff',
                                    }),
                                })}/>
                            <Typography variant="caption">{formatTime(duration)}</Typography>
                        </Stack>
                    </Stack>

                    <Stack direction="row" justifyContent="end" alignItems="end" spacing={3} flex={0.25}>
                        <IconButton onClick={handleRepeat}>
                            <PlayListSettingIcon/>
                        </IconButton>
                        <IconButton onClick={() => handleVolumeChange(volume > 0 ? 0 : 70)}>
                            <VolumeIcon />
                        </IconButton>
                        <Slider
                            sx={{
                                width: 120,
                                height: 4,
                                marginBottom: `4px !important`,
                                color: theme.palette.text.secondary,
                                '& .MuiSlider-thumb': {
                                    width: 12,
                                    height: 12
                                },
                                '& .MuiSlider-rail': {
                                    opacity: 0.28,
                                },
                            }}
                            value={volume * 100}
                            onChange={(e, val) => handleVolumeChange(val)}/>
                    </Stack>
                </Stack>
            </PlayerCard>
        </PlayerWrapper>
    )
}
