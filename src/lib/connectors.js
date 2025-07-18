import { ethers } from 'ethers';

const RPC_URLS = {
  ethereum: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
  polygon:`https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,

  arbitrum: `https://arbitrum-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`,
};

const providers = {
  ethereum: new ethers.providers.JsonRpcProvider(RPC_URLS.ethereum),
  polygon: new ethers.providers.JsonRpcProvider(RPC_URLS.polygon),
  arbitrum: new ethers.providers.JsonRpcProvider(RPC_URLS.arbitrum),
};

const wsProviders = {
  ethereum: new ethers.providers.WebSocketProvider(
    `wss://mainnet.infura.io/ws/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`
  ),
  polygon: new ethers.providers.WebSocketProvider(
    `wss://polygon-mainnet.infura.io/ws/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`
  ),
  arbitrum: new ethers.providers.WebSocketProvider(
    `wss://arbitrum-mainnet.infura.io/ws/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`
  ),
};

export { providers, wsProviders };