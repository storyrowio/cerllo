'use client'

import IconButton from "@mui/material/IconButton";
import {styled} from "@mui/material/styles";
import {HexToRGBA} from "utils/theme";
import PropTypes from "prop-types";

const Wrapper = styled(IconButton, {shouldForwardProp(propName) { return propName }})
(({theme, color}) => ({
    padding: '8px',
    borderRadius: 11,
    background: theme.palette.background.paper,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    '&:hover': {
        background: theme.palette.background.paper
    },

    '& .MuiSvgIcon-root, svg': {
        width: 20,
        height: 20
    },

    ...(color && {
        background: HexToRGBA(theme.palette[color].main, 0.09),
        '&:hover': {
            background: HexToRGBA(theme.palette[color].main, 0.16)
        }
    })
}));

CustomIconButton.propTypes = {
    children: PropTypes.any,
}

export default function CustomIconButton({ children, ...props }) {
    return (
        <Wrapper {...props}>
            {children}
        </Wrapper>
    )
}
