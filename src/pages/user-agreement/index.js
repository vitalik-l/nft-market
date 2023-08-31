import AnimationRevealPage from '../../shared/ui-kit/helpers/AnimationRevealPage';
import { Header } from '../../widgets/header';
import { Footer } from '../../widgets/footer';
import { Container, ContentWithPaddingXl } from '../../shared/ui-kit/components/misc/Layouts';
import { AgreementText } from '../../entities/agreement';

export const UserAgreementPage = () => {
  return (
    <AnimationRevealPage>
      <Header />
      <Container>
        <ContentWithPaddingXl>
          <AgreementText />
        </ContentWithPaddingXl>
      </Container>
      <Footer />
    </AnimationRevealPage>
  );
};
