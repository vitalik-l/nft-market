import { configureChains, createConfig } from '@wagmi/core';
import { alchemyProvider } from '@wagmi/core/providers/alchemy';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';
import { WalletConnectConnector } from '@wagmi/core/connectors/walletConnect';
import { polygon, polygonMumbai } from '@wagmi/core/chains';

export const connectors = {
  metamask: null,
  walletConnect: null
};

export const initWeb3Api = ({ chainId, alchemyApiKey, walletConnectProjectId }) => {
  const chain = { 80001: polygonMumbai, 137: polygon }[chainId];
  if (!chain) throw new Error(`unsupported chain ${chainId}`);
  const chains = [chain];
  connectors.metamask = new MetaMaskConnector({ chains });
  connectors.walletConnect = new WalletConnectConnector({
    chains,
    options: { projectId: walletConnectProjectId, showQrModal: true }
  });
  const { publicClient } = configureChains(chains, [alchemyProvider({ apiKey: alchemyApiKey })]);
  createConfig({
    autoConnect: true,
    connectors: [connectors.metamask, connectors.walletConnect],
    publicClient
  });
};
