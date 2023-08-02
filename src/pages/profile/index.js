import tw from 'twin.macro';
import 'styled-components/macro';
import { Header } from '../../widgets/header';
import React from 'react';
import AnimationRevealPage from '../../shared/ui-kit/helpers/AnimationRevealPage';
import { walletModel } from '../../entities/wallet/model';
import { useGate, useUnit } from 'effector-react';
import { Button } from '../../shared/ui-kit/components/misc/Buttons';
import { Container, ContentWithPaddingXl } from '../../shared/ui-kit/components/misc/Layouts';
import { profileModel } from './model';
import { Spinner } from '../../shared/ui-kit';
import { Link } from 'react-router-dom';
import { NftCard } from '../../entities/collections';
import { Footer } from '../../widgets/footer';

const NftList = ({ addresses = [] }) => {
  const nftBalances = useUnit(profileModel.$accountNftBalances);

  if (!addresses?.length) {
    return (
      <div tw="text-center">
        <div>No items</div>
        <div tw="mt-3">
          <Button as={Link} to="/collections">
            Buy NFT
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div tw="flex">
      {addresses.map((address) => (
        <NftCard address={address} balance={Number(nftBalances[address]?.result)} labelAction="View" key={address} />
      ))}
    </div>
  );
};

export const ProfilePage = () => {
  const account = useUnit(walletModel.$account);
  useGate(profileModel.ProfileGate);
  const accountNfts = useUnit(profileModel.$accountNfts);
  const pending = useUnit(profileModel.$pending);

  return (
    <AnimationRevealPage>
      <Header />
      <Container>
        <ContentWithPaddingXl>
          <div css={tw`flex flex-wrap gap-3 items-center`}>
            <div css={tw`text-[16px] sm:text-xl text-ellipsis overflow-hidden`}>{account.address}</div>
            <Button onClick={() => walletModel.disconnectFx()}>Disconnect</Button>
          </div>
          <div tw="mt-[80px]">
            {pending ? (
              <div css={tw`flex justify-center items-center mt-[80px]`}>
                <Spinner css={tw`text-[60px]`} />
              </div>
            ) : (
              <NftList addresses={accountNfts} />
            )}
          </div>
        </ContentWithPaddingXl>
      </Container>
      <Footer />
    </AnimationRevealPage>
  );
};
