import AnimationRevealPage from '../../shared/ui-kit/helpers/AnimationRevealPage';
import { Header } from 'widgets/header';
import TabCardGrid from 'widgets/nft-cards';
import React from 'react';
import { Footer } from '../../widgets/footer';
import { useParams } from 'react-router-dom';
import { CATEGORIES_KEYS } from '../../shared/config';
import { HighlightedText } from '../../shared/ui-kit/components/misc/HighlightedText';

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
