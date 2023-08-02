import { Button } from 'shared/ui-kit/components/misc/Buttons';
import { useUnit } from 'effector-react';
import { walletModel } from '../model';
import { formatAddress } from '../../../shared/lib/format-address';
import { Link } from 'react-router-dom';

export const ConnectWalletButton = () => {
  const account = useUnit(walletModel.$account);
  const isConnected = !!account?.address;

  const onClick = () => {
    walletModel.toggleModal(true);
  };

  if (isConnected) {
    return (
      <Button as={Link} to={`/account/${account.address}`}>
        {formatAddress(account?.address)}
      </Button>
    );
  }

  return <Button onClick={onClick}>Connect</Button>;
};
