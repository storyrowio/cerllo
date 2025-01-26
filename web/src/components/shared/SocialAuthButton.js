import {Button, styled} from "@mui/material";

const AuthButton= styled(Button)(({theme}) => ({
    paddingTop: 12,
    paddingBottom: 12,
    background: theme.palette.text.primary,

    '&:hover': {
        background: 'white',
    }
}));

export default function SocialAuthButton(props) {
    const { children, ...rest } = props;
    return (
        <AuthButton {...rest}>
            {children}
        </AuthButton>
    )
}
