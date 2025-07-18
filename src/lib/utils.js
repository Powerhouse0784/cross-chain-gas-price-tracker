export const calculateGasCost = (baseFee, priorityFee, usdPrice, chain) => {
  // Standard gas limit for simple ETH transfer
  const gasLimit = chain === 'arbitrum' ? 1000000 : 21000;
  const totalGas = Number(baseFee) + Number(priorityFee);
  const costNative = (totalGas * gasLimit) / 1e18;
  const costUsd = costNative * usdPrice;
  return { costNative, costUsd, gasLimit };
};

export const formatGwei = (wei) => {
  return Math.round(Number(wei) / 1e9 * 100) / 100;
};

export const aggregateToCandles = (data, intervalMinutes = 15) => {
  if (!data.length) return [];
  
  const intervalMs = intervalMinutes * 60 * 1000;
  const candles = [];
  let currentIntervalStart = new Date(data[0].time).getTime();
  let currentIntervalEnd = currentIntervalStart + intervalMs;
  
  let open, high, low, close;
  let currentIntervalData = [];
  
  data.forEach((point) => {
    const pointTime = new Date(point.time).getTime();
    
    if (pointTime >= currentIntervalEnd) {
      if (currentIntervalData.length) {
        const prices = currentIntervalData.map(p => p.price);
        candles.push({
          time: currentIntervalStart / 1000,
          open: prices[0],
          high: Math.max(...prices),
          low: Math.min(...prices),
          close: prices[prices.length - 1],
        });
      }
      
      currentIntervalStart = currentIntervalEnd;
      currentIntervalEnd = currentIntervalStart + intervalMs;
      currentIntervalData = [];
    }
    
    currentIntervalData.push(point);
  });
  
  // Add the last interval if it has data
  if (currentIntervalData.length) {
    const prices = currentIntervalData.map(p => p.price);
    candles.push({
      time: currentIntervalStart / 1000,
      open: prices[0],
      high: Math.max(...prices),
      low: Math.min(...prices),
      close: prices[prices.length - 1],
    });
  }
  
  return candles;
};