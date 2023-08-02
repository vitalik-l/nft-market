import tw from 'twin.macro';
import AnimationRevealPage from '../../shared/ui-kit/helpers/AnimationRevealPage';
import { Header } from 'widgets/header';
import TabCardGrid from 'widgets/nft-cards';
import React from 'react';
import { Footer } from '../../widgets/footer';
import { useParams } from 'react-router-dom';
import { CATEGORIES_KEYS } from '../../shared/config';

const HighlightedText = tw.span`bg-primary-500 text-gray-100 px-4 transform -skew-x-12 inline-block`;

export const CollectionsPage = () => {
  const { collection } = useParams();

  return (
    <AnimationRevealPage>
      <Header />
      <TabCardGrid
        heading={
          <>
            Checkout our <HighlightedText>gallery.</HighlightedText>
          </>
        }
        activeTab={collection ?? CATEGORIES_KEYS[0]}
        asLink
      />
      <Footer />
    </AnimationRevealPage>
  );
};
