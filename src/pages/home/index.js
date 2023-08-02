import { useUnit } from 'effector-react';
import tw from 'twin.macro';
import AnimationRevealPage from '../../shared/ui-kit/helpers/AnimationRevealPage';
import { Header } from 'widgets/header';
import TabCardGrid from 'widgets/nft-cards';
import React from 'react';
import { Footer } from '../../widgets/footer';
import { homePageModel } from './model';

const HighlightedText = tw.span`bg-primary-500 text-gray-100 px-4 transform -skew-x-12 inline-block`;

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
