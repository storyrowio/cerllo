import {Box, Stack, styled, Typography} from "@mui/material";
import Image from "next/image";

const CardItem = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3, 2),
    borderRadius: 20,
    cursor: 'pointer',

    '&:hover': {
        background: theme.palette.background.default
    }
}));

export default function AlbumCard(props) {
    const { image, title, subtitle, ...rest } = props;

    return (
        <CardItem {...rest}>
            <Stack alignItems="center">
                <Box sx={{ width: 150, height: 150, borderRadius: 100, position: 'relative' }}>
                    <Image
                        src={image}
                        alt={title}
                        fill
                        style={{
                            borderRadius: 20,
                            objectFit: 'cover'
                        }}/>
                </Box>
                <Typography fontWeight={600} marginTop={2}>{title}</Typography>
                <Typography variant="caption">{subtitle}</Typography>
            </Stack>
        </CardItem>
    )
}
