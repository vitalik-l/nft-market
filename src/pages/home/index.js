import { useUnit } from 'effector-react';
import AnimationRevealPage from '../../shared/ui-kit/helpers/AnimationRevealPage';
import { Header } from 'widgets/header';
import TabCardGrid from 'widgets/nft-cards';
import React from 'react';
import { Footer } from '../../widgets/footer';
import { homePageModel } from './model';
import { HighlightedText } from '../../shared/ui-kit/components/misc/HighlightedText';
import { ContentWithPaddingXl } from '../../shared/ui-kit/components/misc/Layouts';
import { useTranslation } from 'react-i18next';

const TextCard = ({ title }) => {
  const { t } = useTranslation();

  return (
    <div className="border border-primary-500 rounded-2xl p-4 text-gray-900">
      <span className="title text-xl">{t(`gold.${title}`)}</span>&nbsp;
      <span className="text-xl">{t(`heading.${title}`)}</span>
      <div className="text-lg">{t(`description.${title}`)}</div>
    </div>
  );
};

export const HomePage = () => {
  const activeCategory = useUnit(homePageModel.$activeCategory);
  const { t } = useTranslation();

  return (
    <AnimationRevealPage>
      <Header />
      <ContentWithPaddingXl className="!pb-0">
        <div className="grid gap-6">
          <TextCard title="web3" />
          <TextCard title="ar" />
          <TextCard title="refi" />
          <TextCard title="rwa" />
          <TextCard title="defi" />
        </div>
      </ContentWithPaddingXl>
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
