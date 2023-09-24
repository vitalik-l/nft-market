import { createEvent, createStore, sample } from 'effector';
import { collectionsModel } from '../../entities/collections';

const categoryChanged = createEvent();

const $activeCategory = createStore('').on(categoryChanged, (_, value) => value);

sample({
  source: collectionsModel.$categories,
  fn: (categories) => categories?.[0]?.attributes?.slug ?? '',
  target: categoryChanged
});

export const homePageModel = { categoryChanged, $activeCategory };
