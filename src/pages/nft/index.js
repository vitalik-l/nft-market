import tw from 'twin.macro';
import 'styled-components/macro';
import { Link } from 'react-router-dom';
import { Header } from '../../widgets/header';
import AnimationRevealPage from '../../shared/ui-kit/helpers/AnimationRevealPage';
import React, { useState } from 'react';
import styled from 'styled-components';
import { SectionHeading, Subheading as SubheadingBase } from '../../shared/ui-kit/components/misc/Headings';
import { useParams } from 'react-router-dom';
import { collectionsModel } from '../../entities/collections';
import { Spinner } from 'shared/ui-kit';
import { useUnit } from 'effector-react';
import { usd } from '../../shared/lib/usd';
import { BuyNftForm } from '../../features/buy-nft';
import { walletModel } from '../../entities/wallet/model';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import { Footer } from '../../widgets/footer';
import { CATEGORY_KEY } from '../../shared/config';
import { useTranslation } from 'react-i18next';

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 flex-shrink-0 h-80 md:h-auto relative`;
const TextColumn = styled(Column)((props) => [
  tw`md:w-7/12 mt-16 md:mt-0`,
  props.textOnLeft ? tw`md:mr-12 lg:mr-16 md:order-first` : tw`md:ml-12 lg:ml-16 md:order-last`
]);

const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Subheading = tw(SubheadingBase)`text-center md:text-left capitalize`;
const Heading = tw(
  SectionHeading
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`mt-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;

const Statistics = tw.div`flex flex-wrap items-center sm:block mt-4 gap-[2rem]`;
const Statistic = tw.div`text-left sm:inline-block sm:mr-12 last:mr-0 mt-4`;
const Value = tw.div`font-bold text-lg sm:text-xl lg:text-2xl text-secondary-500 tracking-wide`;
const Key = tw.div`font-medium text-primary-700`;

const HighlightedText = tw.span`bg-primary-500 text-gray-100 px-4 transform -skew-x-12 inline-block`;

const SwiperThumbs = styled(Swiper)`
  .swiper-slide {
    opacity: 0.5;
  }

  .swiper-slide-thumb-active {
    opacity: 1;
  }
`;

export const NftPage = () => {
  const {
    i18n: { language }
  } = useTranslation();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { address } = useParams();
  const metadata = collectionsModel.useMetadata(address);
  const isMetadataLoading = useUnit(collectionsModel.collectionsListFx.pending);
  const priceDollar = collectionsModel.usePriceDollar(address);
  const amountLimit = collectionsModel.useAmountLimit(address);
  const tokenId = collectionsModel.useTokenId(address);
  const walletConnected = useUnit(walletModel.$connected);
  const fullPrice = priceDollar.value * amountLimit.value;
  const isFullPriceLoading = priceDollar.isLoading || amountLimit.isLoading;
  const available = (amountLimit.value ?? 0) - (tokenId.value ?? 0);
  const isAvailableLoading = amountLimit.isLoading || tokenId.isLoading;
  const statistics = [
    {
      key: 'Price for one NFT',
      value: priceDollar.isLoading ? <Spinner /> : usd(priceDollar.value)
    },
    {
      key: 'Available',
      value: isAvailableLoading ? <Spinner /> : `${available}/${amountLimit.value}`
    }
  ];
  const trans = (obj) => obj?.[language];

  return (
    <AnimationRevealPage>
      <Header />
      <Container slideClassName="flex-1">
        {isMetadataLoading ? (
          <div css={tw`flex justify-center items-center mt-[80px]`}>
            <Spinner css={tw`text-[60px]`} />
          </div>
        ) : (
          <TwoColumn>
            <ImageColumn css={tw`md:w-1/2 h-auto w-full`}>
              <div tw="w-full">
                <Swiper
                  modules={[Navigation, Thumbs, FreeMode]}
                  navigation
                  thumbs={{ swiper: thumbsSwiper }}
                  style={{ '--swiper-navigation-sides-offset': '0' }}
                >
                  {metadata.media?.map((item) => (
                    <SwiperSlide key={item?.url}>
                      <img src={item?.url} css={tw`rounded-4xl bg-cover m-auto`} alt="" />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <SwiperThumbs
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  tw="mt-6"
                >
                  {metadata.media?.map((item) => (
                    <SwiperSlide key={item?.url} css={tw`cursor-pointer`}>
                      <img src={item?.url} css={tw`rounded-4xl bg-cover m-auto`} alt="" />
                    </SwiperSlide>
                  ))}
                </SwiperThumbs>
              </div>
            </ImageColumn>
            <TextColumn>
              <TextContent>
                <Subheading as={Link} to={`/collections/${CATEGORY_KEY[metadata.category]}`}>
                  {metadata.category}
                </Subheading>
                <Heading>
                  {trans(metadata.name)}{' '}
                  <HighlightedText>{isFullPriceLoading ? <Spinner /> : usd(fullPrice)}</HighlightedText>
                </Heading>
                <Description>{trans(metadata.description)}</Description>
                <Statistics>
                  {statistics.map((statistic, index) => (
                    <Statistic key={index}>
                      <Value>{statistic.value}</Value>
                      <Key>{statistic.key}</Key>
                    </Statistic>
                  ))}
                </Statistics>
                {walletConnected && available > 0 && <BuyNftForm nftAddress={address} css={tw`mt-[40px]`} />}
              </TextContent>
            </TextColumn>
          </TwoColumn>
        )}
      </Container>
      <Footer />
    </AnimationRevealPage>
  );
};
