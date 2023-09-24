import 'twin.macro';
import 'styled-components/macro';

import { walletModel } from '../model';
import { Modal } from '../../../shared/ui-kit/components/misc/Modal';
import { useUnit } from 'effector-react';
import { Button } from '../../../shared/ui-kit/components/misc/Buttons';

export const ConnectWalletModal = () => {
  const modalOpen = useUnit(walletModel.$modalOpen);
  const isConnecting = useUnit(walletModel.$isConnecting);

  return (
    <Modal open={modalOpen} onClose={() => walletModel.toggleModal(false)} title="Connect a Wallet">
      <div tw="grid p-3 gap-2">
        <Button
          onClick={() => walletModel.connect('metamask')}
          icon={<img src="/images/metamask.svg" tw="w-[1.5em] h-[1.5em]" />}
          loading={isConnecting?.metamask}
          tw="justify-between"
        >
          Metamask
        </Button>
        <Button
          onClick={() => {
            walletModel.connect('walletConnect');
          }}
          icon={<img src="/images/walletconnect.svg" tw="w-[1.5em] h-[1.5em]" />}
          loading={isConnecting?.walletConnect}
          tw="justify-between"
        >
          Wallet Connect
        </Button>
      </div>
    </Modal>
  );
};
