import { createEvent, createStore } from 'effector';
import { CATEGORIES_KEYS } from '../../shared/config';

const categoryChanged = createEvent();

const $activeCategory = createStore(CATEGORIES_KEYS[0]).on(categoryChanged, (_, value) => value);

export const homePageModel = { categoryChanged, $activeCategory };
