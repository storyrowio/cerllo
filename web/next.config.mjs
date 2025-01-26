/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',  // Changed to 'export' for static file generation
    distDir: 'dist',   // Output to dist directory
    images: {
        unoptimized: true, // Required for static export
    },
    trailingSlash: true,
    env: {
        ENVIRONMENT: process.env.ENVIRONMENT,
        VERSION: process.env.VERSION,
        APP_URL: process.env.APP_URL,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        API_URL: process.env.API_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    }
};

export default nextConfig;
