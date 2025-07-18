import { useGasStore } from '../store/gasStore';
export default function ChainSelector() {
  const { chains, usdPrice } = useGasStore();
  
  return (
    <div className="chain-selector">
      {Object.entries(chains).map(([chain, data]) => (
        <div key={chain} className="chain-card">
          <h3>{chain.charAt(0).toUpperCase() + chain.slice(1)}</h3>
          <div className="gas-info">
            <div>
              <span>Base Fee:</span>
              <span>{data.baseFee} Gwei</span>
            </div>
            <div>
              <span>Priority Fee:</span>
              <span>{data.priorityFee} Gwei</span>
            </div>
            <div>
              <span>Last Updated:</span>
              <span>{new Date(data.lastUpdated).toLocaleTimeString()}</span>
            </div>
          </div>
          {usdPrice > 0 && (
            <div className="usd-cost">
              <span>Simple Transfer Cost:</span>
              <span>
                ${((data.baseFee + data.priorityFee) * 21000 * usdPrice / 1e9).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}