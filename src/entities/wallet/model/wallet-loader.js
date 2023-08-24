import { createEvent, createStore, sample } from 'effector';
import { $tx, txCreated, TxStatusEnum, txStatusUpdated, writeContractFx } from '../../../shared/lib/wagmi-effector';

const open = createEvent();
const close = createEvent();
const $data = createStore({ key: '', hash: '' })
  .on(open, (_, { key, hash }) => ({ key, hash }))
  .reset(close);

// open loader when writeContractFx requested
sample({
  source: writeContractFx,
  fn: ({ functionName }) => ({ key: functionName, hash: '' }),
  target: open
});

// close loader when writeContractFx fails
sample({
  source: writeContractFx.fail,
  target: close
});

// open loader when a new tx created
sample({
  source: [$data, $tx],
  clock: txCreated,
  filter: ([data, tx], { hash }) => !data?.key || data?.key === tx[hash]?.functionName,
  fn: ([_, tx], { hash }) => ({ key: tx[hash]?.functionName, hash }),
  target: open
});

// close loader when tx is resolved
sample({
  clock: txStatusUpdated,
  source: $data,
  filter: ({ status }) => status !== TxStatusEnum.PENDING,
  target: close
});

export const walletLoader = {
  open,
  close,
  $data
};
