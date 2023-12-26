import tw from 'twin.macro';
import 'styled-components/macro';
import { Link } from 'react-router-dom';
import { Header } from '../../widgets/header';
import AnimationRevealPage from '../../shared/ui-kit/helpers/AnimationRevealPage';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { SectionHeading } from '../../shared/ui-kit/components/misc/Headings';
import { useParams } from 'react-router-dom';
import { collectionsModel } from '../../entities/collections';
import { Spinner } from 'shared/ui-kit';
import { useStoreMap, useUnit } from 'effector-react';
import { usd } from '../../shared/lib/usd';
import { BuyNftForm } from '../../features/buy-nft';
import { walletModel } from '../../entities/wallet/model';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, FreeMode } from 'swiper/modules';
import { Footer } from '../../widgets/footer';
import { useTranslation } from 'react-i18next';
import { HighlightedText } from '../../shared/ui-kit/components/misc/HighlightedText';
import { PrimaryLink } from '../../shared/ui-kit/components/misc/Links';
import { getMediaUrl, getContent } from '../../shared/api/backend';
import { profileModel } from '../../entities/profile/model';

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 flex-shrink-0 h-80 md:h-auto relative`;
const TextColumn = styled(Column)((props) => [
  tw`md:w-7/12 mt-16 md:mt-0`,
  props.textOnLeft ? tw`md:mr-12 lg:mr-16 md:order-first` : tw`md:ml-12 lg:ml-16 md:order-last`
]);

const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Heading = tw(
  SectionHeading
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`mt-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100 whitespace-break-spaces`;

const Statistics = tw.div`flex flex-wrap items-center sm:block mt-4 gap-[2rem]`;
const Statistic = tw.div`text-left sm:inline-block sm:mr-12 last:mr-0 mt-4`;
const Value = tw.div`font-bold text-lg sm:text-xl lg:text-2xl text-secondary-500 tracking-wide`;
const Key = tw.div`font-medium text-primary-700`;

const SwiperThumbs = styled(Swiper)`
  .swiper-slide {
    opacity: 0.5;
  }

  .swiper-slide-thumb-active {
    opacity: 1;
  }
`;

const Media = ({ url, className, mime, asThumb }) => {
  const src = getMediaUrl(url);
  const isVideo = useMemo(() => mime.indexOf('video') !== -1, [mime]);

  return isVideo ? (
    <video src={src} className={className} controls={!asThumb} />
  ) : (
    <img alt="" src={src} className={className} />
  );
};

export const NftPage = () => {
  const {
    t,
    i18n: { language }
  } = useTranslation();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const { address } = useParams();
  const data = useStoreMap(collectionsModel.$items, (items) => items.byAddress[address?.toLowerCase()]);
  const priceDollar = collectionsModel.usePriceDollar(address);
  const amountLimit = collectionsModel.useAmountLimit(address);
  const tokenId = collectionsModel.useTokenId(address);
  const walletConnected = useUnit(walletModel.$connected);
  const fullPrice = priceDollar.value * amountLimit.value;
  const isFullPriceLoading = priceDollar.isLoading || amountLimit.isLoading;
  const available = (amountLimit.value ?? 0) - (tokenId.value ?? 0);
  const isAvailableLoading = amountLimit.isLoading || tokenId.isLoading;
  const accountBalance = useUnit(profileModel.$accountNftBalances)?.[address?.toLowerCase()]?.result;
  const hasBalance = accountBalance > 0;
  const statistics = [
    {
      key: 'Price for one NFT',
      value: priceDollar.isLoading ? <Spinner /> : usd(priceDollar.value)
    },
    {
      key: 'Available',
      value: isAvailableLoading ? <Spinner /> : `${available}/${amountLimit.value}`
    },
  ];
  if (hasBalance) {
    statistics.push({
      key: 'Your balance',
      value: `${accountBalance}`
    });
  }
  const { name = '', description = '' } = getContent(data) ?? {};
  const modelFileUrl = data?.attributes?.modelFile?.data?.attributes?.url;

  return (
    <AnimationRevealPage>
      <Header />
      <Container slideClassName="flex-1">
        <TwoColumn>
          <ImageColumn css={tw`md:w-1/2 h-auto w-full`}>
            <div tw="w-full">
              <Swiper modules={[Thumbs, FreeMode]} thumbs={{ swiper: thumbsSwiper }}>
                {data?.attributes?.media?.data?.map((item) => (
                  <SwiperSlide key={item?.attributes?.url} tw="relative pt-[100%]">
                    <Media
                      className="absolute top-[0] left-[0] w-[100%] h-[100%] rounded-4xl object-contain m-auto"
                      {...item?.attributes}
                    />
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
                tw="mt-6 px-[24px]"
                navigation
              >
                {data?.attributes?.media?.data?.map((item) => (
                  <SwiperSlide key={item?.attributes?.url} className="cursor-pointer">
                    <div className="relative pt-[100%]">
                      <Media
                        asThumb
                        css={tw`rounded-4xl absolute top-[0] left-[0] w-[100%] h-[100%] rounded-4xl object-cover m-auto`}
                        {...item?.attributes}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </SwiperThumbs>
            </div>
          </ImageColumn>
          <TextColumn>
            <TextContent>
              <PrimaryLink as={Link} to={`/category/${data?.category?.attributes?.slug}`} tw="capitalize">
                {getContent(data?.category)?.name}
              </PrimaryLink>
              <Heading>
                {name} <HighlightedText>{isFullPriceLoading ? <Spinner /> : usd(fullPrice)}</HighlightedText>
              </Heading>
              <Description>{description}</Description>
              {modelFileUrl && hasBalance && (
                <div tw="mt-4">
                  <PrimaryLink href={modelFileUrl}>{t('downloadModel')}</PrimaryLink>
                </div>
              )}
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
      </Container>
      <Footer />
    </AnimationRevealPage>
  );
};
