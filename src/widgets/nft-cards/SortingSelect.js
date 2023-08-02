import { Select } from '../../shared/ui-kit/components/misc/Select';
import { SORT_TYPES } from './model';
import { useTranslation } from 'react-i18next';

export const SortingSelect = () => {
  const { t } = useTranslation();

  return (
    <Select value={SORT_TYPES[0]}>
      {SORT_TYPES.map((type) => (
        <Select.Option value={type} key={type}>
          {t(`sort.${type}`)}
        </Select.Option>
      ))}
    </Select>
  );
};
