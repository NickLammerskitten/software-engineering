/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "127.0.0.1",
                port: "54347",
                pathname: "*/**",
                search: "",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "3000",
                pathname: "*/**",
                search: "",
            },
        ]
    },
    output: "standalone"
};

export default nextConfig;
