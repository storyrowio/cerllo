import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";
import {Card, CardContent, Stack} from "@mui/material";
import AuthIllustration from "layouts/auth/components/AuthIllustration";
import Image from "next/image";

const Wrapper = styled(Box)(({theme}) => ({
    minWidth: '100vw',
    minHeight: '100vh',
    background: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'space-around'
}));

const LeftContent = styled(Box)(({ theme }) => ({
    width: '60%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    [theme.breakpoints.down('lg')]: {
        width: 0
    }
}));

const RightContent = styled(Box)(({ theme }) => ({
    flex: 1,
    padding: '1rem',
    '& .MuiCard-root': {
        height: '100%'
    }
}));

export default function AuthLayout({ children }) {
    return (
        <Wrapper>
            <LeftContent>
                <Box sx={{ width: '100vw', height: '100vh', position: 'absolute'}}>
                    <Image
                        src="/images/background/abstract.svg"
                        alt="bg"
                        fill
                        style={{ objectFit: 'fill'}}/>
                </Box>
                <AuthIllustration/>
            </LeftContent>
            <RightContent>
                <Stack sx={{
                    width: { xs: '90%', md: '70%', lg: '50%' },
                    height: '100%',
                    margin: 'auto'
                }} justifyContent="center" alignItems="center">
                    {children}
                </Stack>
            </RightContent>
        </Wrapper>
    )
}
