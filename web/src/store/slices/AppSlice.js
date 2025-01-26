import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isAuthed: false,
    currentPlay: {
        song: {},
        index: null,
        isPlaying: false,
    },
    isPlaying: false,
};

export const AppSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setIsAuthed: (state, action) => {
            state.isAuthed = action.payload;
        },
        setCurrentPlay: (state, action) => {
            state.currentPlay = action.payload;
        },
        setIsPlaying: (state, action) => {
            state.currentPlay.isPlaying = action.payload;
        }
    }
});

export const AppActions = AppSlice.actions;
export default AppSlice;
