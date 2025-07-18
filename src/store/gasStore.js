import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Named export for the store creator
export const createGasStore = () => 
  create(
    persist(
      (set, get) => ({
        mode: 'live',
        usdPrice: 0,
        chains: {
          ethereum: { baseFee: 0, priorityFee: 0, history: [], lastUpdated: null },
          polygon: { baseFee: 0, priorityFee: 0, history: [], lastUpdated: null },
          arbitrum: { baseFee: 0, priorityFee: 0, history: [], lastUpdated: null },
        },
        simulation: {
          transactionValue: '0',
          selectedChain: 'ethereum',
        },
        setMode: (mode) => set({ mode }),
        setUsdPrice: (price) => set({ usdPrice: price }),
        updateChainData: (chain, data) => set((state) => ({
          chains: {
            ...state.chains,
            [chain]: {
              ...state.chains[chain],
              ...data,
              lastUpdated: new Date().toISOString(),
            },
          },
        })),
        addHistoryPoint: (chain, point) => set((state) => ({
          chains: {
            ...state.chains,
            [chain]: {
              ...state.chains[chain],
              history: [...state.chains[chain].history, point].slice(-100),
            },
          },
        })),
        setSimulation: (simulation) => set({ simulation }),
      }),
      {
        name: 'gas-tracker-storage',
        storage: createJSONStorage(() => localStorage),
      }
    )
  );

// Client-side only store initialization
let clientStore;

// Named export for the hook
export const useGasStore = (selector) => {
  // Server-side rendering fallback
  if (typeof window === 'undefined') {
    return selector({
      mode: 'live',
      usdPrice: 0,
      chains: {
        ethereum: { baseFee: 0, priorityFee: 0, history: [], lastUpdated: null },
        polygon: { baseFee: 0, priorityFee: 0, history: [], lastUpdated: null },
        arbitrum: { baseFee: 0, priorityFee: 0, history: [], lastUpdated: null },
      },
      simulation: {
        transactionValue: '0',
        selectedChain: 'ethereum',
      },
      // Dummy functions that won't be called during SSR
      setMode: () => {},
      setUsdPrice: () => {},
      updateChainData: () => {},
      addHistoryPoint: () => {},
      setSimulation: () => {},
    });
  }

  // Initialize store on client side
  if (!clientStore) {
    clientStore = createGasStore();
  }

  return clientStore(selector);
};