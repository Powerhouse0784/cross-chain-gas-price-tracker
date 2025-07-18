import { useState, useEffect } from 'react';
import { useGasStore } from '../store/gasStore';
import { calculateGasCost } from '../lib/utils';

export default function WalletSimulator() {
  const { mode, usdPrice, chains, simulation, setMode, setSimulation } = useGasStore();
  const [transactionValue, setTransactionValue] = useState(simulation.transactionValue);
  const [selectedChain, setSelectedChain] = useState(simulation.selectedChain);
  const [costs, setCosts] = useState({});

  useEffect(() => {
    if (mode === 'simulation') {
      const newCosts = {};
      Object.keys(chains).forEach((chain) => {
        const { baseFee, priorityFee } = chains[chain];
        const txValue = chain === selectedChain ? transactionValue : '0';
        const { costUsd } = calculateGasCost(
          baseFee * 1e9,
          priorityFee * 1e9,
          usdPrice,
          chain
        );
        newCosts[chain] = {
          gasCost: costUsd,
          totalCost: costUsd + (parseFloat(txValue) * usdPrice || 0),
        };
      });
      setCosts(newCosts);
    }
  }, [mode, transactionValue, selectedChain, chains, usdPrice]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSimulation({ transactionValue, selectedChain });
    setMode('simulation');
  };

  const switchToLiveMode = () => {
    setMode('live');
  };

  return (
    <div className="simulator-container">
      {mode === 'live' ? (
        <button onClick={() => setMode('simulation')}>Enter Simulation Mode</button>
      ) : (
        <>
          <button onClick={switchToLiveMode}>Return to Live Mode</button>
          <form onSubmit={handleSubmit}>
            <div>
              <label>
                Transaction Value:
                <input
                  type="number"
                  step="0.0001"
                  min="0"
                  value={transactionValue}
                  onChange={(e) => setTransactionValue(e.target.value)}
                />
                {selectedChain === 'polygon' ? 'MATIC' : 'ETH'}
              </label>
            </div>
            <div>
              <label>
                Chain:
                <select
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(e.target.value)}
                >
                  <option value="ethereum">Ethereum</option>
                  <option value="polygon">Polygon</option>
                  <option value="arbitrum">Arbitrum</option>
                </select>
              </label>
            </div>
            <button type="submit">Update Simulation</button>
          </form>
          
          {Object.keys(costs).length > 0 && (
            <div className="costs-table">
              <h3>Estimated Costs (USD)</h3>
              <table>
                <thead>
                  <tr>
                    <th>Chain</th>
                    <th>Gas Cost</th>
                    <th>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(costs).map(([chain, { gasCost, totalCost }]) => (
                    <tr key={chain}>
                      <td>{chain.charAt(0).toUpperCase() + chain.slice(1)}</td>
                      <td>${gasCost.toFixed(2)}</td>
                      <td>${totalCost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}