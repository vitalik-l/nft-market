import { createEffect, createEvent, createStore } from 'effector';
import { connect, disconnect, switchNetwork, watchAccount, watchNetwork } from '@wagmi/core';
import { metamaskConnector, walletConnectConnector } from '../../../shared/api/web3';
import { CHAIN_CONFIG } from '../../../shared/config';
import { logFxError } from '../../../shared/lib/log-fx-error';
import { txStatusUpdated, TxStatusEnum } from '../../../shared/lib/wagmi-effector';

const toggleModal = createEvent();
const accountChanged = createEvent();
const networkChanged = createEvent();
const init = createEvent();

let unwatchAccount = null,
  unwatchNetwork = null;
init.watch(() => {
  unwatchAccount?.();
  unwatchNetwork?.();
  unwatchAccount = watchAccount(accountChanged);
  unwatchNetwork = watchNetwork(networkChanged);
});

const CONNECTORS = {
  metamask: metamaskConnector,
  walletConnect: walletConnectConnector
};

const connectFx = createEffect(async (connector) => {
  if (!CONNECTORS[connector]) return;
  try {
    return await connect({ chainId: CHAIN_CONFIG.id, connector: CONNECTORS[connector] });
  } catch (err) {
    // fallback for mobile version
    if (err?.name === 'ConnectorNotFoundError') {
      return connect({ chainId: CHAIN_CONFIG.id, connector: CONNECTORS.walletConnect });
    }
    throw err;
  }
});
connectFx.fail.watch(logFxError('connectFx'));

const disconnectFx = createEffect(async () => {
  return disconnect();
});

const switchNetworkFx = createEffect(async ({ chainId }) => {
  return switchNetwork({ chainId });
});
switchNetworkFx.fail.watch(logFxError('switchNetworkFx'));

const $connection = createStore({})
  .on(connectFx.doneData, (_, data) => data)
  .reset(disconnectFx.doneData);

const $modalOpen = createStore(false)
  .on(toggleModal, (state, value) => {
    if (value === undefined) return !state;
    return value;
  })
  .reset(connectFx.done);

const $account = createStore({}).on(accountChanged, (_, data) => data);

const $network = createStore({}).on(networkChanged, (_, data) => data);

const $connected = $account.map((account) => !!account?.address);

const $isSupportedNetwork = $network.map((network) => !!network?.chain && !network.chain?.unsupported);

const $isConnecting = createStore({ metamask: false, walletConnect: false })
  .on(connectFx, (state, payload) => {
    return { ...state, [payload]: true };
  })
  .on(connectFx.done, (state, { params }) => ({ ...state, [params]: false }))
  .on(connectFx.fail, (state, { params }) => ({ ...state, [params]: false }));

const $txToasts = createStore([]).on(txStatusUpdated, (state, payload) => {
  if (payload?.status !== TxStatusEnum.FULFILLED) return state;
  return [...state, payload];
});

export const walletModel = {
  $modalOpen,
  $connection,
  connectFx,
  toggleModal,
  $account,
  disconnectFx,
  init,
  $connected,
  $network,
  $isSupportedNetwork,
  switchNetworkFx,
  $isConnecting,
  $txToasts
};
