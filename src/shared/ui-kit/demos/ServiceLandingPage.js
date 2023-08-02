import React from 'react';
import tw from 'twin.macro';
import { css } from 'styled-components/macro'; //eslint-disable-line
import AnimationRevealPage from 'shared/ui-kit/helpers/AnimationRevealPage.js';

import Hero from 'shared/ui-kit/components/hero/TwoColumnWithFeaturesAndTestimonial.js';
import Features from 'shared/ui-kit/components/features/ThreeColWithSideImage.js';
import MainFeature from 'shared/ui-kit/components/features/TwoColWithTwoHorizontalFeaturesAndButton.js';
import FeatureStats from 'shared/ui-kit/components/features/ThreeColCenteredStatsPrimaryBackground.js';
import Pricing from 'shared/ui-kit/components/pricing/TwoPlansWithDurationSwitcher.js';
import Blog from 'shared/ui-kit/components/blogs/GridWithFeaturedPost.js';
import Testimonial from 'shared/ui-kit/components/testimonials/TwoColumnWithImageAndRating.js';
import FAQ from 'shared/ui-kit/components/faqs/SingleCol.js';
import GetStarted from 'shared/ui-kit/components/cta/GetStartedLight.js';
import Footer from 'shared/ui-kit/components/footers/FiveColumnWithInputForm.js';

const HighlightedText = tw.span`text-primary-500`;

export default () => {
  return (
    <AnimationRevealPage>
      <Hero />
      <FeatureStats />
      <Features
        heading={
          <>
            Amazing <HighlightedText>Features</HighlightedText>
          </>
        }
      />
      <MainFeature
        heading={
          <>
            Cloud built by and for <HighlightedText>Professionals</HighlightedText>
          </>
        }
      />
      <Testimonial
        heading={
          <>
            Our Clients <HighlightedText>Love Us</HighlightedText>
          </>
        }
      />
      <Pricing
        heading={
          <>
            Flexible <HighlightedText>Plans</HighlightedText>
          </>
        }
      />
      <FAQ
        heading={
          <>
            Any <HighlightedText>Questions ?</HighlightedText>
          </>
        }
      />
      <Blog
        subheading="Blog"
        heading={
          <>
            We love <HighlightedText>Writing</HighlightedText>
          </>
        }
      />
      <GetStarted />
      <Footer />
    </AnimationRevealPage>
  );
};
