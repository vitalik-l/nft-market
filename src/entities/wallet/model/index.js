import { createEffect, createEvent, createStore, sample } from 'effector';
import { connect as wagmiConnect, disconnect, switchNetwork, watchAccount, watchNetwork } from '@wagmi/core';
import { connectors } from '../../../shared/api/web3';
import { logFxError } from '../../../shared/lib/log-fx-error';
import { txStatusUpdated, TxStatusEnum } from '../../../shared/lib/wagmi-effector';
import { configModel } from '../../../shared/config/model';

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

const connectFx = createEffect(async ({ connector, chainId }) => {
  if (!connectors[connector]) return;
  try {
    return await wagmiConnect({ chainId, connector: connectors[connector] });
  } catch (err) {
    // fallback for mobile version
    if (err?.name === 'ConnectorNotFoundError') {
      return wagmiConnect({ chainId, connector: connectors.walletConnect });
    }
    throw err;
  }
});
connectFx.fail.watch(logFxError('connectFx'));

const connect = createEvent();

sample({
  clock: connect,
  source: configModel.$chain,
  fn: (chain, connector) => ({ connector, chainId: Number(chain?.attributes?.chainId) }),
  target: connectFx
});

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
  .on(connectFx, (state, { connector }) => {
    return { ...state, [connector]: true };
  })
  .on(connectFx.done, (state, { params: { connector } }) => ({ ...state, [connector]: false }))
  .on(connectFx.fail, (state, { params: { connector } }) => ({ ...state, [connector]: false }));

const $txToasts = createStore([]).on(txStatusUpdated, (state, payload) => {
  if (payload?.status !== TxStatusEnum.FULFILLED) return state;
  return [...state, payload];
});

export const walletModel = {
  $modalOpen,
  $connection,
  toggleModal,
  $account,
  disconnectFx,
  init,
  $connected,
  $network,
  $isSupportedNetwork,
  switchNetworkFx,
  $isConnecting,
  $txToasts,
  accountChanged,
  networkChanged,
  connect
};
