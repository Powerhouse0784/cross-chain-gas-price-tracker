import { useEffect } from 'react';
import { useGasStore } from '../store/gasStore';
import { providers, wsProviders } from '../lib/connectors';
import { getEthUsdPrice } from '../lib/uniswap';
import { formatGwei, calculateGasCost } from '../lib/utils';

export default function GasTracker() {
  const {
    mode,
    usdPrice,
    chains,
    updateChainData,
    addHistoryPoint,
    setUsdPrice,
  } = useGasStore();

  useEffect(() => {
    // Fetch initial data
    const fetchInitialData = async () => {
      try {
        // Get ETH/USD price
        const price = await getEthUsdPrice(providers.ethereum);
        setUsdPrice(price);
        
        // Get initial gas data for all chains
        await Promise.all(
          Object.keys(providers).map(async (chain) => {
            const block = await providers[chain].getBlock('latest');
            const feeData = await providers[chain].getFeeData();
            
            updateChainData(chain, {
              baseFee: formatGwei(feeData.maxFeePerGas),
              priorityFee: formatGwei(feeData.maxPriorityFeePerGas),
            });
            
            addHistoryPoint(chain, {
              time: new Date().toISOString(),
              price: formatGwei(feeData.maxFeePerGas),
            });
          })
        );
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    
    fetchInitialData();
    
    // Set up WebSocket listeners for each chain
    const cleanups = Object.keys(wsProviders).map((chain) => {
      const provider = wsProviders[chain];
      
      provider.on('block', async (blockNumber) => {
        try {
          const block = await provider.getBlock(blockNumber);
          const feeData = await provider.getFeeData();
          
          updateChainData(chain, {
            baseFee: formatGwei(feeData.maxFeePerGas),
            priorityFee: formatGwei(feeData.maxPriorityFeePerGas),
          });
          
          addHistoryPoint(chain, {
            time: new Date().toISOString(),
            price: formatGwei(feeData.maxFeePerGas),
          });
          
          // Update ETH price every 10 blocks for Ethereum
          if (chain === 'ethereum' && blockNumber % 10 === 0) {
            const price = await getEthUsdPrice(provider);
            setUsdPrice(price);
          }
        } catch (error) {
          console.error(`Error processing block for ${chain}:`, error);
        }
      });
      
      return () => provider.removeAllListeners();
    });
    
    return () => {
      cleanups.forEach(cleanup => cleanup());
      Object.values(wsProviders).forEach(provider => provider.removeAllListeners());
    };
  }, [updateChainData, addHistoryPoint, setUsdPrice]);

  return null;
}