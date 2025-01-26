import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";

export default function Logo(props) {
    let { width = 160, height = 50 } = props;

    return (
        <Box sx={{
            width,
            height,
            position: 'relative' }}>
            <Image src="/images/logos/logo.svg" alt="logo" fill/>
        </Box>
    )
}
