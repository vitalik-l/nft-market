import React from 'react';
import AnimationRevealPage from 'shared/ui-kit/helpers/AnimationRevealPage.js';
import Hero from 'shared/ui-kit/components/hero/FullWidthWithImage.js';
import Features from 'shared/ui-kit/components/features/ThreeColSimple.js';
import MainFeature from 'shared/ui-kit/components/features/TwoColSingleFeatureWithStats.js';
import SliderCard from 'shared/ui-kit/components/cards/ThreeColSlider.js';
import TrendingCard from 'shared/ui-kit/components/cards/TwoTrendingPreviewCardsWithImage.js';
import Blog from 'shared/ui-kit/components/blogs/PopularAndRecentBlogPosts.js';
import Testimonial from 'shared/ui-kit/components/testimonials/TwoColumnWithImageAndProfilePictureReview.js';
import FAQ from 'shared/ui-kit/components/faqs/SimpleWithSideImage.js';
import SubscribeNewsLetterForm from 'shared/ui-kit/components/forms/SimpleSubscribeNewsletter.js';
import Footer from 'shared/ui-kit/components/footers/MiniCenteredFooter.js';

export default () => (
  <AnimationRevealPage>
    <Hero />
    <Features />
    <SliderCard />
    <TrendingCard />
    <MainFeature />
    <Blog />
    <Testimonial textOnLeft={true} />
    <FAQ />
    <SubscribeNewsLetterForm />
    <Footer />
  </AnimationRevealPage>
);
