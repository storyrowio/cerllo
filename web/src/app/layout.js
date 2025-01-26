'use client'

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootApp from "layouts/RootApp";
import HolyLoader from "holy-loader";
import {Provider} from "react-redux";
import store from "store";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import {GoogleAdSense} from "nextjs-google-adsense";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
      <html lang="en">
      <GoogleTagManager gtmId="GTM-PQJFTSTQ" />
      <GoogleAdSense publisherId="pub-9155496041062406" />

      <head>
          <title>Cerllo</title>
          <meta name='admaven-placement' content="BrHr7qTr4"/>
          <meta name="google-adsense-account" content="ca-pub-9155496041062406"/>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
      <HolyLoader color="#757575"/>
      <Provider store={store}>
          <RootApp>
              {children}
          </RootApp>
      </Provider>
      </body>
      <GoogleAnalytics gaId="G-SBRWSQY67H"/>
      </html>
  );
}
