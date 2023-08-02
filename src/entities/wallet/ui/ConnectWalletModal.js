import 'twin.macro';
import 'styled-components/macro';

import { walletModel } from '../model';
import { Modal } from '../../../shared/ui-kit/components/misc/Modal';
import { useUnit } from 'effector-react';
import { OutlinedButton } from '../../../shared/ui-kit/components/misc/Buttons';

export const ConnectWalletModal = () => {
  const modalOpen = useUnit(walletModel.$modalOpen);

  return (
    <Modal open={modalOpen} onClose={() => walletModel.toggleModal(false)} title="Connect a Wallet">
      <div tw="grid p-3 gap-2">
        <OutlinedButton
          onClick={() => walletModel.connectFx('metamask')}
          icon={<img src="/images/metamask.svg" tw="w-[1.5em] h-[1.5em]" />}
        >
          Metamask
        </OutlinedButton>
        <OutlinedButton
          onClick={() => {
            walletModel.connectFx('walletConnect');
          }}
          icon={<img src="/images/walletconnect.svg" tw="w-[1.5em] h-[1.5em]" />}
        >
          Wallet Connect
        </OutlinedButton>
      </div>
    </Modal>
  );
};
