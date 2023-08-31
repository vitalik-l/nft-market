import { createEvent, createStore, sample } from 'effector';
import { persist } from 'effector-storage/local';

const confirm = createEvent();
const $confirmed = createStore(false, { name: 'confirmed' }).on(confirm, () => true);
const open = createEvent();
const $isOpen = createStore(false).on(open, (_, v) => v ?? true);

persist({ store: $confirmed });

sample({
  source: confirm,
  fn: () => false,
  target: open
});

export const agreementModel = {
  confirm,
  $confirmed,
  open,
  $isOpen
};
