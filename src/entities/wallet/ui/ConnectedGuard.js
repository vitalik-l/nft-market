import tw from 'twin.macro';
import 'styled-components/macro';
import { useUnit } from 'effector-react';
import { walletModel } from '../model';
import { ConnectWalletButton } from './ConnectWalletButton';
import { Container, ContentWithPaddingXl } from '../../../shared/ui-kit/components/misc/Layouts';
import { Header } from '../../../widgets/header';
import React from 'react';
import AnimationRevealPage from '../../../shared/ui-kit/helpers/AnimationRevealPage';
import { Footer } from '../../../widgets/footer';

export const ConnectedGuard = ({ children, fallback }) => {
  const connected = useUnit(walletModel.$connected);

  if (!connected) {
    return (
      fallback ?? (
        <AnimationRevealPage>
          <Header />
          <Container slideClassName="flex-1">
            <ContentWithPaddingXl>
              <div css={tw`flex justify-center`}>
                <ConnectWalletButton />
              </div>
            </ContentWithPaddingXl>
          </Container>
          <Footer />
        </AnimationRevealPage>
      )
    );
  }

  return children;
};
