import { createGate } from 'effector-react';
import { combine, createEffect, createStore, sample } from 'effector';
import { backendApi } from '../../shared/api/backend';
import { logFxError } from '../../shared/lib/log-fx-error';
import { $locale } from '../../shared/i18n';

export const FAQGate = createGate();

const faqFx = createEffect(backendApi.getFaq);
faqFx.fail.watch(logFxError('faq'));

const $faqHtml = createStore({}).on(faqFx.done, (state, { params, result }) => {
  const content = result?.data?.attributes?.html;
  if (!content) return state;
  return {
    ...state,
    [params.locale]: content
  };
});

const $html = combine($locale, $faqHtml, (locale, html) => html[locale]);

sample({
  source: [FAQGate.status, $locale, $faqHtml],
  filter: ([gateStatus, locale, html]) => {
    return !html[locale] && gateStatus;
  },
  fn: ([, locale]) => ({ locale }),
  target: faqFx
});

export const faqModel = {
  $html
};
