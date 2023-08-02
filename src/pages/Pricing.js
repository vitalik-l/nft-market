import React from 'react';
import AnimationRevealPage from 'shared/ui-kit/helpers/AnimationRevealPage.js';
import Header from 'shared/ui-kit/components/headers/light.js';
import Pricing from 'shared/ui-kit/components/pricing/TwoPlansWithDurationSwitcher.js';
import Testimonial from 'shared/ui-kit/components/testimonials/ThreeColumnWithProfileImage.js';
import Footer from 'shared/ui-kit/components/footers/FiveColumnWithInputForm.js';
import FAQ from 'shared/ui-kit/components/faqs/SingleCol.js';

export default () => {
  return (
    <AnimationRevealPage>
      <Header />
      <Pricing />
      <Testimonial heading="Our Paying Customers" />
      <FAQ />
      <Footer />
    </AnimationRevealPage>
  );
};
