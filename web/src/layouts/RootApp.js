'use client'

import {usePathname} from "next/navigation";
import {Suspense} from "react";
import Theme from "theme";
import AppLayout from "layouts/app/AppLayout";
import AuthLayout from "layouts/auth/AuthLayout";

export default function RootApp({ children }) {
    const pathname = usePathname();

    let Layout = AppLayout;

    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
        Layout = AuthLayout;
    }

    // if (pathname.includes('/app')) {
    //     Layout = AppLayout;
    // }

    return (
        <Suspense>
            <Theme>
                <Layout>
                    {children}
                </Layout>
            </Theme>
        </Suspense>
    )
}
