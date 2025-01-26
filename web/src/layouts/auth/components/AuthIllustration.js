import {usePathname} from "next/navigation";
import Image from "next/image";
import Box from "@mui/material/Box";

export default function AuthIllustration() {
    const pathname = usePathname();
    let illustration = '/images/auth/login.svg';
    if (pathname === '/register') {
        illustration = '/images/auth/register.svg'
    }

    return (
        <Box sx={{
            width: {xs: 0, lg: '80%'},
            height: '90vh',
            position: 'relative'
        }}>
            <Image
                src={illustration}
                alt="auth-illustration"
                fill
            />
        </Box>
    )
}
