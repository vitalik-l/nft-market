import { ReactComponent as TwitterIcon } from '../../shared/ui-kit/images/twitter-icon.svg';
import { ReactComponent as TelegramIcon } from '../../shared/ui-kit/images/telegram-icon.svg';
import React from 'react';
import tw from 'twin.macro';
import 'styled-components/macro';
import styled from 'styled-components';

const Container = tw.div`relative bg-gray-200 text-gray-700 -mb-8 -mx-8 p-8 md:py-16`;
const Content = tw.div`max-w-screen-xl mx-auto relative z-10`;

const ThreeColRow = tw.div`flex flex-col md:flex-row items-center justify-between`;

const LogoContainer = tw.div`flex items-center justify-center md:justify-start gap-2 text-lg`;
const LogoImg = tw.img`w-8`;
const LogoText = tw.h5`font-black tracking-wider text-gray-800`;

const CopywrightNotice = tw.p`text-center text-sm sm:text-base mt-8 md:mt-0 font-medium text-gray-500`;

const SocialLinksContainer = tw.div`mt-8 md:mt-0 flex`;
const SocialLink = styled.a`
  ${tw`cursor-pointer p-2 rounded-full bg-gray-900 text-gray-100 hover:bg-gray-700 transition duration-300 mr-4 last:mr-0`}
  svg {
    ${tw`w-4 h-4`}
  }
`;

export const Footer = () => {
  return (
    <Container>
      <Content>
        <ThreeColRow>
          <LogoContainer>
            <LogoText>Powered by</LogoText>
            <LogoImg src="/images/polygon.svg" />
            <LogoText>Polygon</LogoText>
          </LogoContainer>
          <CopywrightNotice>&copy; 2023 Agedor. All Rights Reserved.</CopywrightNotice>
          <SocialLinksContainer>
            <SocialLink href="https://t.me/agedor" target="_blank">
              <TelegramIcon />
            </SocialLink>
            <SocialLink href="https://twitter.com/agedorgallery?s=21&t=UfsBXRsqMNbR6y-bWd3p9g" target="_blank">
              <TwitterIcon />
            </SocialLink>
          </SocialLinksContainer>
        </ThreeColRow>
      </Content>
    </Container>
  );
};
