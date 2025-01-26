'use client'

import Player from "components/shared/Player";
import {
    Box,
    Grid2,
    Stack,
    useMediaQuery
} from "@mui/material";
import AdsterraBanner from "components/ads/AdsterraBanner";
import Playlist from "components/shared/Playlist";
import useSWR from "swr";
import SongService from "services/SongService";

export default function Home() {
    const mobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

    const { data: resData, mutate } = useSWR('/api/song',
        () => SongService.GetSongByQuery({})
    );

    const songs = [
        {
            title: 'Eh Eh Nothing Else I Can Say',
            artist: 'Lady Gaga',
            url: 'https://res.cloudinary.com/drsnew2wz/video/upload/v1737532138/cerllo/Lady_Gaga_-_Eh_Eh_Nothing_Else_I_Can_Say_yptihj.mp3'
        },
        {
            title: 'More Than This',
            artist: 'One Direction',
            url: 'https://res.cloudinary.com/drsnew2wz/video/upload/v1737528825/cerllo/One_Direction_-_More_Than_This_Audio_jlos3o.mp3'
        },
        {
            title: 'Big Girls Don\'t Cry',
            artist: 'Fergie',
            url: 'https://res.cloudinary.com/drsnew2wz/video/upload/v1737553602/cerllo/Fergie_-_Big_Girls_Don_t_Cry_Audio_i4s242.mp3'
        },
        {
            title: 'Cruel Summer',
            artist: 'Taylor Swift',
            url: 'https://res.cloudinary.com/drsnew2wz/video/upload/v1737614506/cerllo/Taylor_Swift_-_Cruel_Summer_Official_Audio_ygakuc.mp3'
        },
    ];

    return (
       <>
           <Box sx={{ width: '100vw' }}>
               <Grid2 container spacing={2}>
                   {!mobile && (
                       <Grid2 size={{ md: 2, lg: 2 }}>
                           <Stack alignItems="center">
                               <AdsterraBanner domainSource="bladderssewing.com" adsKey="9110e384c574047eae3cb6d1ce3d160b" width={160} height={300}/>
                           </Stack>
                       </Grid2>
                   )}
                   <Grid2 size={{ xs: 12, md: 8, lg: 8 }}>
                       <Playlist songs={resData?.data ?? []}/>
                   </Grid2>
                   {!mobile && (
                       <Grid2 size={{ md: 2, lg: 2 }}>
                           <Stack alignItems="center">
                               <AdsterraBanner domainSource="bladderssewing.com" adsKey="9110e384c574047eae3cb6d1ce3d160b" width={160} height={300}/>
                           </Stack>
                       </Grid2>
                   )}
               </Grid2>
               {mobile && (
                   <Stack alignItems="center" sx={{ marginTop: 3 }}>
                       <AdsterraBanner adsKey="9110e384c574047eae3cb6d1ce3d160b" width={160} height={300}/>
                   </Stack>
               )}
           </Box>
           <Player songs={resData?.data ?? []}/>
       </>
);
}
