import { Select } from '../../shared/ui-kit/components/misc/Select';
import { SORT_TYPE_KEYS, nftCardsModel } from './model';
import { useTranslation } from 'react-i18next';
import { useUnit } from 'effector-react';

export const SortingSelect = () => {
  const { t } = useTranslation();
  const value = useUnit(nftCardsModel.$order);

  return (
    <Select value={value} onChange={({ target }) => nftCardsModel.orderChanged(target.value)}>
      {SORT_TYPE_KEYS.map((type) => (
        <Select.Option value={type} key={type}>
          {t(`sort.${type}`)}
        </Select.Option>
      ))}
    </Select>
  );
};
