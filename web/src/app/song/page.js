'use client'

import Playlist from "components/shared/Playlist";
import useSWR from "swr";
import SongService from "services/SongService";
import {BasicSort} from "constants/constants";
import {useDispatch} from "store";
import {AppActions} from "store/slices/AppSlice";
import {Box, Card, CardContent, Stack} from "@mui/material";
import ArtistCard from "components/card/ArtistCard";
import AlbumCard from "components/card/AlbumCard";
import SongList from "components/pages/home/SongList";
import AdsterraBanner from "components/ads/AdsterraBanner";

export default function Song() {
    const dispatch = useDispatch();

    const { data: resData } = useSWR(
        '/api/song',
        () => SongService.GetSongByQuery({sort: BasicSort.newest.value}),
        {onSuccess: (res) => {
                dispatch(AppActions.setSongs(res?.data));
            }
        }
    );

    return (
        <Stack direction="row">
            <Box sx={{
                width: 'calc(100% - 200px)'
            }}>
                <Playlist songs={resData?.data ?? []}/>
            </Box>
            <AdsterraBanner domainSource="bladderssewing.com" adsKey="4265b0c31cfd9dd61b13afb31bd13a16" width={160} height={600}/>
        </Stack>
    )
}
