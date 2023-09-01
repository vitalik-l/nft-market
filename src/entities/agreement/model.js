import { createEvent, createStore, sample } from 'effector';
import { persist } from 'effector-storage/local';

const confirm = createEvent();
const $confirmed = createStore(false, { name: 'confirmed' }).on(confirm, () => true);
const open = createEvent();
const close = createEvent();
const $isOpen = createStore(false)
  .on(open, (_, v) => v ?? true)
  .reset(close);
const $key = createStore('').on(open, (_, v) => v ?? '');

persist({ store: $confirmed });

sample({
  source: confirm,
  target: close
});

export const agreementModel = {
  confirm,
  $confirmed,
  open,
  close,
  $isOpen,
  $key
};
