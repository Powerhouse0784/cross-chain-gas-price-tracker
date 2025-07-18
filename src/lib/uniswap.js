import { ethers } from 'ethers';

const UNISWAP_V3_ETH_USDC_POOL = '0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8';
const USDC_DECIMALS = 6;

export async function getEthUsdPrice(provider) {
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

    if (!events.length) {
      console.log('No swap events found');
      return 0;
    }

    const latestEvent = events[events.length - 1];
    const sqrtPriceX96 = latestEvent.args.sqrtPriceX96.toString();
    
    // Calculate price from sqrtPriceX96
    const price = (sqrtPriceX96 ** 2) * (10 ** (USDC_DECIMALS - 18)) / (2 ** 192);
    
    return price;
  } catch (error) {
    console.error('Error fetching ETH/USD price:', error);
    return 0;
  }
}