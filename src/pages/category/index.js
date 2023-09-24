import AnimationRevealPage from '../../shared/ui-kit/helpers/AnimationRevealPage';
import { Header } from 'widgets/header';
import TabCardGrid from 'widgets/nft-cards';
import React from 'react';
import { Footer } from '../../widgets/footer';
import { useParams } from 'react-router-dom';
import { HighlightedText } from '../../shared/ui-kit/components/misc/HighlightedText';
import { useUnit } from 'effector-react';
import { collectionsModel } from '../../entities/collections';

export const CategoryPage = () => {
  const { slug } = useParams();
  const categories = useUnit(collectionsModel.$categories);

  return (
    <AnimationRevealPage>
      <Header />
      <TabCardGrid
        heading={
          <>
            Checkout our <HighlightedText>gallery.</HighlightedText>
          </>
        }
        activeTab={slug ?? categories?.[0]?.attributes?.slug}
        asLink
      />
      <Footer />
    </AnimationRevealPage>
  );
};
