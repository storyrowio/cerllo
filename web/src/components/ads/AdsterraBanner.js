'use client'

import {useEffect, useRef} from "react";
import {Box, useTheme} from "@mui/material";

const AdsterraBanner = ({ domainSource, adsKey, width, height, nativeBanner = false }) => {
    const theme = useTheme();

    const banner = useRef();
    const atOptions = {
        key: adsKey,
        format: 'iframe',
        height: height ?? 250,
        width: width ?? 300,
        params: {},
    }

    useEffect(() => {
        if (!banner.current.firstChild && adsKey) {
            const conf = document.createElement('script')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `//${domainSource}/${atOptions.key}/invoke.js`
            if (!nativeBanner) {
                conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`
            } else {
                script.async = true
                script["data-cfasync"] = "false"
            }

            if (banner.current) {
                banner.current.append(conf)
                banner.current.append(script)
            }
        }
    }, [adsKey])

    return (
        <>
            <Box ref={banner}/>
            {nativeBanner && (
                <div id={`container-${adsKey}`}></div>
            )}
        </>
    );
};

export default AdsterraBanner;
