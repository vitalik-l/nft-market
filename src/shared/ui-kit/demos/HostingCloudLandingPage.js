import React from 'react';
import AnimationRevealPage from 'shared/ui-kit/helpers/AnimationRevealPage.js';
import Hero from 'shared/ui-kit/components/hero/TwoColumnWithPrimaryBackground.js';
import Features from 'shared/ui-kit/components/features/ThreeColWithSideImageWithPrimaryBackground.js';
import MainFeature from 'shared/ui-kit/components/features/TwoColWithButton.js';
import Pricing from 'shared/ui-kit/components/pricing/ThreePlansWithHalfPrimaryBackground.js';
import Testimonial from 'shared/ui-kit/components/testimonials/SimplePrimaryBackground.js';
import FAQ from 'shared/ui-kit/components/faqs/TwoColumnPrimaryBackground.js';
import Footer from 'shared/ui-kit/components/footers/FiveColumnDark.js';
import serverRedundancyIllustrationImageSrc from 'shared/ui-kit/images/server-redundancy-illustration.svg';
import serverSecureIllustrationImageSrc from 'shared/ui-kit/images/server-secure-illustration.svg';

export default () => {
  return (
    <AnimationRevealPage>
      <Hero />
      <Features />
      <Pricing />
      <MainFeature
        subheading="Reliable"
        heading="Highly Redundant Servers With Backup"
        imageSrc={serverRedundancyIllustrationImageSrc}
        buttonRounded={false}
      />
      <MainFeature
        subheading="Secure"
        heading="State of the Art Computer Security"
        imageSrc={serverSecureIllustrationImageSrc}
        buttonRounded={false}
        textOnLeft={false}
      />
      <Testimonial />
      <FAQ />
      <Footer />
    </AnimationRevealPage>
  );
};
