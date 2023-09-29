import { Header } from '../../widgets/header';
import React from 'react';
import AnimationRevealPage from '../../shared/ui-kit/helpers/AnimationRevealPage';
import { Footer } from '../../widgets/footer';
import { ContentWithPaddingXl } from '../../shared/ui-kit/components/misc/Layouts';

export const PageNotFound = () => {
  return (
    <AnimationRevealPage>
      <Header />
      <div className="relative">
        <ContentWithPaddingXl>
          <div className="text-center text-[42px] font-bold">
            <div className="text-[2em]">404</div>
            <div>Page Not Found</div>
          </div>
        </ContentWithPaddingXl>
      </div>
      <Footer />
    </AnimationRevealPage>
  );
};
