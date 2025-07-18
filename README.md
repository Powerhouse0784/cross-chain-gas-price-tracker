# 🚀 Real-Time Cross-Chain Gas Price Tracker with Wallet Simulation

A full-stack **Next.js + Web3** dashboard that fetches real-time gas prices from **Ethereum**, **Polygon**, and **Arbitrum** using native RPCs (no third-party APIs), calculates live **USD transaction cost** using **Uniswap V3 pool logs**, and visualizes gas volatility using **candlestick charts**. It also includes a **wallet simulator** to compare cross-chain gas + transaction costs interactively.

---

## 🧠 Objective

Build a performant, developer-first dashboard that:
- 🟢 **Fetches gas prices** from Ethereum, Polygon, and Arbitrum every 6 seconds.
- 💸 **Calculates real-time transaction cost in USD** using live on-chain price data from Uniswap V3.
- 📊 **Visualizes gas price trends** in an interactive 15-minute candlestick chart using `lightweight-charts`.
- 🧪 **Simulates wallet interactions**, showing how much a transfer would cost on each chain.

---

## 🚀 Features

### ✅ Real-Time Gas Tracking
- Connects directly to Ethereum, Polygon, and Arbitrum RPCs via WebSocket.
- Fetches and updates gas data every 6 seconds per chain.
- Tracks both **base fee** and **priority fee** for each chain.

### ✅ Wallet Simulation
- Accepts user input for transaction value in ETH/MATIC/ETH.
- Simulates the **USD cost of gas + transaction** for each chain.
- Live ETH/USD prices are computed from Uniswap V3's ETH/USDC pool using on-chain logs.

### ✅ Gas Price Visualization
- Displays 15-minute candlestick charts for gas price volatility.
- Uses `lightweight-charts` library for interactive chart rendering.

---

## 🛠️ Tech Stack

| Category      | Tech                                    |
|---------------|------------------------------------------|
| Frontend      | React.js (with Next.js)                  |
| Blockchain    | Ethers.js + Web3                         |
| State Mgmt    | Zustand                                  |
| Charts        | Lightweight-Charts                       |
| Chains Used   | Ethereum Mainnet, Polygon, Arbitrum      |
| Pricing Oracle| Uniswap V3 ETH/USDC Pool (On-Chain Logs) |

---

## 🧮 Key Functionalities

### ✅ Real-Time Gas Engine
- Uses native WebSocket connections to Ethereum/Polygon/Arbitrum RPCs.
- Listens for new blocks and extracts:
  - `baseFeePerGas`
  - `maxPriorityFeePerGas`
- Updates Zustand store every **6 seconds** per chain.

### ✅ On-Chain ETH/USD Pricing
- Directly reads `Swap` events from [Uniswap V3 ETH/USDC Pool](https://etherscan.io/address/0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8).
- Calculates ETH/USD using:
  ```ts
  price = (sqrtPriceX96 ** 2 * 10^12) / 2 ** 192
