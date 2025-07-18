import dynamic from 'next/dynamic';
import { useGasStore } from '../store/gasStore';
import styles from '../styles/Home.module.css';

// Dynamic imports with SSR disabled
const ChainSelector = dynamic(() => import('../components/ChainSelector'), { 
  ssr: false,
  loading: () => <div>Loading chain data...</div>
});

const PriceChart = dynamic(() => import('../components/PriceChart'), { 
  ssr: false,
  loading: () => <div>Loading chart...</div>
});

const WalletSimulator = dynamic(() => import('../components/WalletSimulator'), { 
  ssr: false,
  loading: () => <div>Loading wallet simulator...</div>
});

export default function Home() {
  // These will now work safely with the new store implementation
  const mode = useGasStore((state) => state.mode);
  const selectedChain = useGasStore((state) => state.simulation.selectedChain);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Cross-Chain Gas Tracker</h1>
        <p className={styles.mode}>Current Mode: {mode}</p>
        
        <ChainSelector />
        
        <div className={styles.chartContainer}>
          <h2>{selectedChain.charAt(0).toUpperCase() + selectedChain.slice(1)} Gas Price History</h2>
          <PriceChart chain={selectedChain} />
        </div>
        
        <WalletSimulator />
      </main>
    </div>
  );
}