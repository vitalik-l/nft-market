import { createStore, sample } from 'effector';
import { $tx, txFulfilled, TxStatusEnum, txStatusUpdated, writeContractFx } from '../../../shared/lib/wagmi-effector';

export const createFxStatus = (key) => {
  const fail = sample({
    source: writeContractFx.fail,
    filter: ({ params: { functionName } }) => functionName === key
  });

  const done = sample({
    source: $tx,
    clock: txFulfilled,
    filter: (tx, { hash }) => tx[hash]?.functionName === key,
    fn: (tx, { hash }) => tx[hash]
  });

  const $loading = createStore(false);

  sample({
    source: writeContractFx,
    filter: ({ functionName }) => functionName === key,
    fn: () => true,
    target: $loading
  });

  sample({
    source: writeContractFx.fail,
    filter: ({ params: { functionName } }) => functionName === key,
    fn: () => false,
    target: $loading
  });

  sample({
    source: $tx,
    clock: txStatusUpdated,
    filter: (tx, { hash }) => tx[hash]?.functionName === key,
    fn: (tx, { hash }) => tx[hash]?.status === TxStatusEnum.PENDING,
    target: $loading
  });

  return {
    fail,
    done,
    $loading
  };
};
