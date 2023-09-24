import { useUnit } from 'effector-react';
import { useTranslation } from 'react-i18next';
import { ErrorToast, SuccessToast } from '../components/misc/Toast';
import { createEvent, createStore } from 'effector';
import { Fragment } from 'react';

export const toast = createEvent();
const $toasts = createStore([]).on(toast, (state, payload) => [...state, payload]);

export const Toasts = () => {
  const toasts = useUnit($toasts);
  const { t } = useTranslation();

  const render = {
    success: ({ content, title }) => <SuccessToast title={t(title)}>{content}</SuccessToast>,
    error: ({ content, title }) => <ErrorToast title={title} message={content} />
  };

  return (
    <>
      {toasts.map(({ type, content, title }, index) => (
        <Fragment key={index}>{render[type]({ content, title })}</Fragment>
      ))}
    </>
  );
};
