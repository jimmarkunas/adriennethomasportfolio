import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js"

/** @type {import('next').NextConfig | ((phase: string) => import('next').NextConfig)} */
const nextConfig = (phase) => ({
  // Keep static export for non-dev builds, but avoid dev asset routing bugs.
  ...(phase === PHASE_DEVELOPMENT_SERVER ? {} : { output: "export" }),
  // Keep dev and build artifacts separate so stale manifests/chunks cannot collide.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  trailingSlash: true,
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    return config
  },
})

export default nextConfig
