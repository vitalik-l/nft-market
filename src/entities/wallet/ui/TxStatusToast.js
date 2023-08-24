import { useUnit } from 'effector-react';
import { walletModel } from '../model';
import { SuccessToast } from '../../../shared/ui-kit/components/misc/Toast';
import { PrimaryLink } from '../../../shared/ui-kit/components/misc/Links';
import { formatAddress } from '../../../shared/lib/format-address';
import { useTranslation } from 'react-i18next';
import { SCANNER_URL } from '../../../shared/config';

export const TxStatusToast = () => {
  const txToasts = useUnit(walletModel.$txToasts);
  const { t } = useTranslation();

  return (
    <>
      {txToasts.map((tx) => (
        <SuccessToast key={tx.hash} title={t('Confirmed transaction')}>
          <PrimaryLink href={`${SCANNER_URL}/tx/${tx.hash}`} target="_blank">
            {formatAddress(tx.hash, 5, 5)}
          </PrimaryLink>
        </SuccessToast>
      ))}
    </>
  );
};
