import { useGasStore } from '../store/gasStore';  // Changed from default import
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  // Initialize store if needed
  if (typeof window !== 'undefined') {
    useGasStore(state => state); // This triggers store initialization
  }

  return <Component {...pageProps} />;
}

export default MyApp;