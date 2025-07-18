import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['lightweight-charts', 'fancy-canvas'],
  webpack: (config, { isServer }) => {
    // Fix for lightweight-charts and fancy-canvas
    config.resolve.alias = {
      ...config.resolve.alias,
      'lightweight-charts': path.resolve(__dirname, 'node_modules/lightweight-charts/dist/lightweight-charts.esm.js'),
      'fancy-canvas': path.resolve(__dirname, 'node_modules/fancy-canvas/dist/fancy-canvas.js'),
    };

    // Web3 compatibility fallbacks
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify/browser'),
      path: require.resolve('path-browserify'),
    };

    return config;
  },
};

export default nextConfig;