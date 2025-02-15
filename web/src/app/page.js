'use client'

import {
    Box, Card, CardContent,
    Grid2,
    Stack, Typography,
    useMediaQuery, useTheme
} from "@mui/material";
import AdsterraBanner from "components/ads/AdsterraBanner";
import Playlist from "components/shared/Playlist";
import useSWR from "swr";
import SongService from "services/SongService";
import {useEffect} from "react";
import {useDispatch} from "store";
import {AppActions} from "store/slices/AppSlice";
import ArtistService from "services/ArtistService";
import Image from "next/image";
import ArtistCard from "components/card/ArtistCard";
import AlbumService from "services/AlbumService";
import AlbumCard from "components/card/AlbumCard";
import {BasicSort} from "constants/constants";
import SongCard from "components/card/SongCard";
import SongList from "components/pages/home/SongList";
import {useRouter} from "next/navigation";

export default function Home() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const router = useRouter();

    const { data: resData } = useSWR('/api/song', () => SongService.GetSongByQuery({sort: BasicSort.newest.value}));
    const { data: resArtists } = useSWR('/api/artist', () => ArtistService.GetArtistByQuery({limit: 6}));
    const { data: resAlbums } = useSWR('/api/album', () => AlbumService.GetAlbumByQuery({limit: 6}));

    useEffect(() => {
        if (resData?.data) {
            dispatch(AppActions.setSongs(resData?.data));
        }
    }, [resData?.data]);

    return (
       <Stack direction="row">
           <Box sx={{
               width: 'calc(100% - 200px)'
           }}>
               <Card elevation={0}>
                   <CardContent sx={{ padding: theme.spacing(2, 5) }}>
                       <Stack direction="row" justifyContent="space-between" spacing={2}>
                           {resArtists?.data?.map((e, i) => (
                               <ArtistCard
                                   key={i}
                                   image={e.image}
                                   title={e.name}
                                onClick={() => router.push(`/artist/${e.id}`)}/>
                           ))}
                       </Stack>
                   </CardContent>
               </Card>
               <Card elevation={0} sx={{ marginTop: 3 }}>
                   <CardContent sx={{ padding: theme.spacing(2, 5) }}>
                       <Stack direction="row" justifyContent="space-between" spacing={2}>
                           {resAlbums?.data?.map((e, i) => (
                               <AlbumCard
                                   key={i}
                                   image={e.image}
                                   title={e.title}
                                   subtitle={e.artist?.name}
                                   onClick={() => router.push(`/album/${e.id}`)}/>
                           ))}
                       </Stack>
                   </CardContent>
               </Card>
               <Card elevation={0} sx={{ marginTop: 3 }}>
                   <CardContent sx={{ padding: theme.spacing(2, 5) }}>
                       <Stack direction="row" justifyContent="space-between" spacing={2}>
                           <SongList songs={resData?.data}/>
                       </Stack>
                   </CardContent>
               </Card>
           </Box>
           <AdsterraBanner domainSource="highperformanceformat.com" adsKey="4265b0c31cfd9dd61b13afb31bd13a16" width={160} height={600}/>
       </Stack>
);
}
