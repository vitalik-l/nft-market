import { configureChains, createConfig } from '@wagmi/core';
import { alchemyProvider } from '@wagmi/core/providers/alchemy';
import { CHAIN_CONFIG, ALCHEMY_API_KEY, WALLET_CONNECT_PROJECT_ID } from '../config';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect';

export const chains = [CHAIN_CONFIG];
const { publicClient } = configureChains(chains, [alchemyProvider({ apiKey: ALCHEMY_API_KEY })]);

export const metamaskConnector = new MetaMaskConnector({ chains });
export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: { projectId: WALLET_CONNECT_PROJECT_ID, showQrModal: true }
});

export const initWeb3Api = () =>
  createConfig({
    autoConnect: true,
    connectors: [metamaskConnector, walletConnectConnector],
    publicClient
  });
