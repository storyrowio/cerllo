'use client'

import {useParams} from "next/navigation";
import useSWR from "swr";
import PlaylistService from "services/PlaylistService";
import {AppActions} from "store/slices/AppSlice";
import {useDispatch} from "store";
import {Box, Card, CardContent, Grid2, Stack, useTheme} from "@mui/material";
import AdsterraBanner from "components/ads/AdsterraBanner";
import Playlist from "components/shared/Playlist";
import SongService from "services/SongService";
export default function ArtistSongPage() {
    const { artistId } = useParams();
    const dispatch = useDispatch();
    const theme = useTheme();

    const { data: resData } = useSWR(
        artistId ? '/api/artist/song' : null,
        () => SongService.GetSongByQuery({artist: artistId}),
        {
            revalidateOnMount: false,
            onSuccess: (res) => {
                dispatch(AppActions.setSongs(res?.data));
            }
        }
    );

    return (
        <Stack direction="row">
            <Box sx={{
                width: 'calc(100% - 240px)'
            }}>
                <Card elevation={0} sx={{ marginTop: 3 }}>
                    <CardContent sx={{ padding: theme.spacing(2, 5) }}>
                        <Playlist songs={resData?.data ?? []}/>
                    </CardContent>
                </Card>
                <Box height={50}/>
                <AdsterraBanner domainSource="highperformanceformat.com" adsKey="4265b0c31cfd9dd61b13afb31bd13a16" width={320} height={50}/>
                <Grid2 container spacing={3}>
                    <Grid2 size={{ xs: 12, sm: 12, lg: 6, xl: 6}}>
                        <AdsterraBanner domainSource="highperformanceformat.com" adsKey="4265b0c31cfd9dd61b13afb31bd13a16" width={320} height={50}/>
                    </Grid2>
                    <Grid2 size={{ xs: 12, sm: 12, lg: 6, xl: 6}}>
                        <AdsterraBanner domainSource="highperformanceformat.com" adsKey="4265b0c31cfd9dd61b13afb31bd13a16" width={320} height={50}/>
                    </Grid2>
                </Grid2>
            </Box>
            <Box width={240}>
                <AdsterraBanner domainSource="highperformanceformat.com" adsKey="4265b0c31cfd9dd61b13afb31bd13a16" width={160} height={600}/>
            </Box>
        </Stack>
    )
}
