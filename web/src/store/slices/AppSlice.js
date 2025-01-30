import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    songs: [],
    isAuthed: false,
    currentPlay: {
        song: {},
        index: null,
        isPlaying: false,
    },
    isPlaying: false,
    playlists: [],
    playlistForm: false,
    currentPlaylist: null
};

export const AppSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setSongs: (state, action) => {
            state.songs = action.payload;
        },
        setIsAuthed: (state, action) => {
            state.isAuthed = action.payload;
        },
        setCurrentPlay: (state, action) => {
            state.currentPlay = action.payload;
        },
        setIsPlaying: (state, action) => {
            state.currentPlay.isPlaying = action.payload;
        },
        setPlaylists: (state, action) => {
            state.playlists = action.payload;
        },
        setPlaylistForm: (state, action) => {
            state.playlistForm = action.payload;
        },
        setCurrentPlaylist: (state, action) => {
            state.currentPlaylist = action.payload;
        },
    }
});

export const AppActions = AppSlice.actions;
export default AppSlice;
