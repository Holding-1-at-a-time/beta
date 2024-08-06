// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        useDeploymentId: true,
        // Optionally, use with Server Actions
        useDeploymentIdServerActions: true,
    },
};

export default nextConfig;
