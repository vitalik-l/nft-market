import { ReactComponent as TwitterIcon } from '../../shared/ui-kit/images/twitter-icon.svg';
import { ReactComponent as TelegramIcon } from '../../shared/ui-kit/images/telegram-icon.svg';
import { ReactComponent as YoutubeIcon } from '../../shared/ui-kit/images/youtube-icon.svg';
import { ReactComponent as TiktokIcon } from '../../shared/ui-kit/images/tiktok-icon.svg';
import { ReactComponent as LinkedinIcon } from '../../shared/ui-kit/images/linkedin-icon.svg';
import React from 'react';
import tw from 'twin.macro';
import 'styled-components/macro';
import styled from 'styled-components';
import { agreementModel } from '../../entities/agreement';
import { ButtonBase } from '../../shared/ui-kit/components/misc/Buttons';
import { Link } from 'react-router-dom';

const Container = tw.div`relative text-gray-700 -mb-8 -mx-8 p-8 md:py-16`;
const Content = tw.div`max-w-screen-xl mx-auto relative z-10`;

const ThreeColRow = tw.div`flex flex-col md:flex-row items-center justify-between`;

const LogoContainer = tw.div`flex items-center justify-center md:justify-start gap-2 text-lg`;
const LogoImg = tw.img`w-8`;
const LogoText = tw.h5`font-black tracking-wider text-gray-800 whitespace-nowrap`;

const CopyrightNotice = tw.p`text-center text-sm sm:text-base mt-8 md:mt-0 font-medium`;

const StyledLink = tw(ButtonBase)`underline font-medium text-sm`;
const NavLink = tw(Link)`underline font-medium text-sm text-center`;

const SocialLinksContainer = tw.div`flex items-center gap-4 justify-center`;
const SocialLink = styled.a`
  ${tw`cursor-pointer p-2 rounded-full bg-gray-900 text-gray-100 hover:bg-gray-700 transition duration-300 last:mr-0`}
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
          <CopyrightNotice>&copy; 2023 Agedor. All Rights Reserved.<br />Maison de Montmorency, S-1195479/001 Monténégro.</CopyrightNotice>
          <div tw="mt-8 md:mt-0">
            <div tw="flex gap-4 justify-center md:justify-end">
              <NavLink to="/faq">FAQ</NavLink>
              <StyledLink onClick={() => agreementModel.open()}>Terms and Conditions</StyledLink>
            </div>
            <div tw="flex flex-wrap gap-4 items-center mt-2">
              <SocialLinksContainer>
                <SocialLink href="https://t.me/agedor" target="_blank">
                  <TelegramIcon />
                </SocialLink>
                <SocialLink href="https://twitter.com/agedorgallery?s=21&t=UfsBXRsqMNbR6y-bWd3p9g" target="_blank">
                  <TwitterIcon />
                </SocialLink>
                <SocialLink href="https://youtube.com/@Agedorart" target="_blank">
                  <YoutubeIcon />
                </SocialLink>
                <SocialLink href="https://vt.tiktok.com/ZSFmBn8QD/" target="_blank">
                  <TiktokIcon />
                </SocialLink>
                <SocialLink href="https://www.linkedin.com/posts/maison-de-montmorency_celebrities-activity-7190639205671149568-yDSf" target="_blank">
                  <LinkedinIcon />
                </SocialLink>
              </SocialLinksContainer>
            </div>
          </div>
        </ThreeColRow>
      </Content>
    </Container>
  );
};
