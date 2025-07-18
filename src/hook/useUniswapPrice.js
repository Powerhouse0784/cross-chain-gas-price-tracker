import { useEffect } from 'react';
import { ethers } from 'ethers';
import { useGasStore } from '../store/gasStore';

const UNISWAP_V3_ETH_USDC_POOL = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8';

export const useUniswapPrice = () => {
  const setUsdPrice = useGasStore((state) => state.setUsdPrice);

  useEffect(() => {
    // Skip entirely during SSR
    if (typeof window === 'undefined') return;

    const provider = new ethers.providers.WebSocketProvider(
      `wss://mainnet.infura.io/ws/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`
    );

    const fetchPrice = async () => {
      try {
        const poolContract = new ethers.Contract(
          UNISWAP_V3_ETH_USDC_POOL,
          ['event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)'],
          provider
        );

        const currentBlock = await provider.getBlockNumber();
        const events = await poolContract.queryFilter(
          poolContract.filters.Swap(),
          currentBlock - 10,
          currentBlock
        );

        if (events.length) {
          const latestEvent = events[events.length - 1];
          const sqrtPriceX96 = latestEvent.args.sqrtPriceX96.toString();
          const price = (sqrtPriceX96 ** 2) * (10 ** 6) / (2 ** 192);
          setUsdPrice(price);
        }
      } catch (error) {
        console.error('Error fetching ETH price:', error);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 15000);

    return () => {
      clearInterval(interval);
      provider.removeAllListeners();
    };
  }, [setUsdPrice]);
};