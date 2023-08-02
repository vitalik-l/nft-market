import { useUnit } from 'effector-react';
import AnimationRevealPage from '../../shared/ui-kit/helpers/AnimationRevealPage';
import { Header } from 'widgets/header';
import TabCardGrid from 'widgets/nft-cards';
import React from 'react';
import { Footer } from '../../widgets/footer';
import { homePageModel } from './model';
import { HighlightedText } from '../../shared/ui-kit/components/misc/HighlightedText';

export const HomePage = () => {
  const activeCategory = useUnit(homePageModel.$activeCategory);

  return (
    <AnimationRevealPage>
      <Header />
      <TabCardGrid
        heading={
          <>
            Checkout our <HighlightedText>gallery.</HighlightedText>
          </>
        }
        onChange={homePageModel.categoryChanged}
        activeTab={activeCategory}
      />
      <Footer />
    </AnimationRevealPage>
  );
};
