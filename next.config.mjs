import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url); // ✅ allows using require in ESM

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lightweight-charts', 'fancy-canvas'],
  webpack: (config) => {
    // Add alias to fix module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      'fancy-canvas/coordinate-space': require.resolve('fancy-canvas/coordinate-space.js'),
    };

    // Required fallbacks for Web3 compatibility
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    };

    return config;
  },
};

export default nextConfig;
