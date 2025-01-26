import {Card, CardContent} from "@mui/material";

export default function AppBody({ children }) {
    return (
        <Card sx={{ minHeight: '100%' }}>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}
