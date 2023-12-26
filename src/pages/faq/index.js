import { FAQGate } from './model';
import { useUnit } from 'effector-react';
import { faqModel } from './model';
import AnimationRevealPage from '../../shared/ui-kit/helpers/AnimationRevealPage';
import { Header } from '../../widgets/header';
import { Footer } from '../../widgets/footer';
import { Container, ContentWithPaddingXl } from '../../shared/ui-kit/components/misc/Layouts';
import styles from './index.module.scss';
import { SectionHeading } from '../../shared/ui-kit/components/misc/Headings';

export const FAQPage = () => {
  const html = useUnit(faqModel.$html);

  return (
    <AnimationRevealPage>
      <Header />
      <Container>
        <FAQGate />
        <ContentWithPaddingXl>
          <SectionHeading className="mb-[40px]">FAQ</SectionHeading>
          <div className={styles.root} dangerouslySetInnerHTML={{ __html: html }}></div>
        </ContentWithPaddingXl>
      </Container>
      <Footer />
    </AnimationRevealPage>
  );
};
