import { createEffect, createEvent, createStore, sample } from 'effector';
import { prepareWriteContract, waitForTransaction, writeContract } from '@wagmi/core';
import { logFxError } from './log-fx-error';

const waitForTransactionFx = createEffect(waitForTransaction);
waitForTransactionFx.fail.watch(logFxError('waitForTransactionFx'));

const writeContractFx = createEffect(async ({ address = '', functionName = '', abi = [], ...params }) => {
  const { request } = await prepareWriteContract({
    address,
    functionName,
    abi,
    ...params
  });
  return writeContract(request);
});
writeContractFx.fail.watch(logFxError('writeContractFx'));

const TxStatusEnum = {
  PENDING: 0,
  FULFILLED: 1,
  REJECTED: 2
};
const txCreated = createEvent();
const txStatusUpdated = createEvent();
const txFulfilled = txStatusUpdated.prepend(({ hash }) => ({ hash, status: TxStatusEnum.FULFILLED }));
const txRejected = txStatusUpdated.prepend(({ hash }) => ({ hash, status: TxStatusEnum.REJECTED }));
const $tx = createStore({})
  .on(txCreated, (state, { functionName, hash, args, address }) => {
    return { ...state, [hash]: { functionName, status: TxStatusEnum.PENDING, args, address } };
  })
  .on(txStatusUpdated, (state, { hash, status }) => {
    if (!state[hash]) return;
    return {
      ...state,
      [hash]: {
        ...state[hash],
        status
      }
    };
  });

sample({
  source: writeContractFx.done,
  fn: ({ params, result: { hash } }) => ({
    hash,
    ...params
  }),
  target: txCreated
});

sample({
  source: txCreated,
  fn: ({ hash }) => ({ hash }),
  target: waitForTransactionFx
});

sample({
  source: waitForTransactionFx.done,
  fn: ({ params: { hash } }) => ({ hash }),
  target: txFulfilled
});

sample({
  source: waitForTransactionFx.fail,
  fn: ({ params: { hash } }) => ({ hash }),
  target: txRejected
});

export { writeContractFx, $tx, txCreated, txFulfilled, txRejected, txStatusUpdated, TxStatusEnum };
