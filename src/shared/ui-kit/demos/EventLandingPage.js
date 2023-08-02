import React from 'react';
import AnimationRevealPage from 'shared/ui-kit/helpers/AnimationRevealPage.js';
import Hero from 'shared/ui-kit/components/hero/BackgroundAsImageWithCenteredContent.js';
import Features from 'shared/ui-kit/components/features/VerticalWithAlternateImageAndText.js';
import Blog from 'shared/ui-kit/components/blogs/ThreeColSimpleWithImage.js';
import Testimonial from 'shared/ui-kit/components/testimonials/TwoColumnWithImage.js';
import ContactUsForm from 'shared/ui-kit/components/forms/SimpleContactUs.js';
import Footer from 'shared/ui-kit/components/footers/SimpleFiveColumn.js';

export default () => (
  <AnimationRevealPage>
    <Hero />
    <Features />
    <Blog />
    <Testimonial />
    <ContactUsForm />
    <Footer />
  </AnimationRevealPage>
);
