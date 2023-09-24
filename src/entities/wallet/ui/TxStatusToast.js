import { useUnit } from 'effector-react';
import { walletModel } from '../model';
import { SuccessToast } from '../../../shared/ui-kit/components/misc/Toast';
import { PrimaryLink } from '../../../shared/ui-kit/components/misc/Links';
import { formatAddress } from '../../../shared/lib/format-address';
import { useTranslation } from 'react-i18next';
import { configModel } from '../../../shared/config/model';

export const TxStatusToast = () => {
  const txToasts = useUnit(walletModel.$txToasts);
  const chain = useUnit(configModel.$chain);
  const { t } = useTranslation();

  return (
    <>
      {txToasts.map((tx) => (
        <SuccessToast key={tx.hash} title={t('Confirmed transaction')}>
          <PrimaryLink href={`${chain?.attributes?.scannerUrl}/tx/${tx.hash}`} target="_blank">
            {formatAddress(tx.hash, 5, 5)}
          </PrimaryLink>
        </SuccessToast>
      ))}
    </>
  );
};
