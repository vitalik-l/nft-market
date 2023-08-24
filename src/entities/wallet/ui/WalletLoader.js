import { useUnit } from 'effector-react';
import { walletLoader } from '../model/wallet-loader';
import { Modal } from '../../../shared/ui-kit/components/misc/Modal';
import { Spinner } from '../../../shared/ui-kit';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../shared/ui-kit/components/misc/Buttons';
import { PrimaryLink } from '../../../shared/ui-kit/components/misc/Links';
import { SCANNER_URL } from '../../../shared/config';
import { formatAddress } from '../../../shared/lib/format-address';

const close = () => walletLoader.close();

export const WalletLoader = () => {
  const { t } = useTranslation();
  const { key, hash } = useUnit(walletLoader.$data);
  const open = !!key;

  return (
    <Modal open={open} onClose={() => close()} title={t('Transaction')}>
      <div className="p-3 text-center grid gap-[2rem]">
        {hash ? (
          <div>
            <div className="text-[18px]">{t('waitingForTransaction')}</div>
            <PrimaryLink href={`${SCANNER_URL}/tx/${hash}`} target="_blank">
              {formatAddress(hash)}
            </PrimaryLink>
          </div>
        ) : (
          <div className="text-[18px]">{t('confirmInWallet')}</div>
        )}
        <div className="flex justify-center text-[42px] text-primary-500">
          <Spinner />
        </div>
        <div>
          <Button onClick={() => close()}>{t('Close')}</Button>
        </div>
      </div>
    </Modal>
  );
};
