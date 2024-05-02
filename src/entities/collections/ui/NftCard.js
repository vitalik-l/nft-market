import tw from 'twin.macro';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { css } from 'styled-components/macro';
import { Button } from '../../../shared/ui-kit/components/misc/Buttons';
import { useStoreMap } from 'effector-react';
import { collectionsModel } from '../model';
import { Link } from 'react-router-dom';
import { usd } from '../../../shared/lib/usd';
import { useTranslation } from 'react-i18next';
import { getContent, getMediaUrl } from '../../../shared/api/backend';
import { Spinner } from '../../../shared/ui-kit';
import React from 'react';

const CardContainer = tw.div`mt-10 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 sm:pr-10 md:pr-6 lg:pr-12`;
const Card = tw(
  motion(Link)
)`border border-primary-500 rounded-2xl block max-w-xs mx-auto sm:max-w-none sm:mx-0 overflow-hidden`;
const CardImageContainer = styled.div`
  ${(props) =>
    css`
      background-image: url('${props.imageSrc}');
    `}
  ${tw`h-64 bg-cover relative rounded-t`}
`;
const CardRatingContainer = tw.div`leading-none absolute inline-flex bg-gray-100 bottom-0 left-0 ml-4 mb-4 rounded-full px-5 py-2 items-end`;
const CardRating = styled.div`
  ${tw`mr-1 text-sm font-bold flex items-end`}
  svg {
    ${tw`w-4 h-4 fill-current text-orange-400 mr-1`}
  }
`;

const CardHoverOverlay = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0.7);
  ${tw`absolute inset-0 flex justify-center items-center`}
`;

const CardReview = tw.div`font-medium text-xs text-gray-600`;

const CardText = tw.div`p-4 text-gray-900`;
const CardTitle = tw.h5`text-lg font-semibold group-hover:text-primary-500`;
const CardContent = tw.p`mt-1 text-base font-medium`;
const CardPrice = tw.div`text-xl font-bold`;

export const NftCard = ({ address, onClick, balance, labelAction = 'Buy Now' }) => {
  const { t } = useTranslation();
  const data = useStoreMap(collectionsModel.$items, (items) => items.byAddress?.[address?.toLowerCase()]);
  const price = collectionsModel.usePriceDollar(address);
  const amountLimit = collectionsModel.useAmountLimit(address);
  const fullPrice = price?.value * amountLimit?.value;
  const imageSrc = getMediaUrl(data?.attributes?.image?.data?.attributes?.url);
  const tokenId = collectionsModel.useTokenId(address);
  const available = (amountLimit.value ?? 0) - (tokenId.value ?? 0);
  const isAvailableLoading = amountLimit.isLoading || tokenId.isLoading;
  const rating = 5;
  const reviews = 0;
  const { name: title, descriptionShort: content } = getContent(data) ?? {};
  const isProfile = balance != null;

  return (
    <CardContainer>
      <Card className="group" to={`/nft/${address}`} initial="rest" whileHover="hover" animate="rest" onClick={onClick}>
        <CardImageContainer imageSrc={imageSrc}>
          {/*<CardRatingContainer>*/}
          {/*  <CardRating>*/}
          {/*    <StarIcon />*/}
          {/*    {rating}*/}
          {/*  </CardRating>*/}
          {/*  <CardReview>({reviews})</CardReview>*/}
          {/*</CardRatingContainer>*/}
          <CardHoverOverlay
            variants={{
              hover: {
                opacity: 1,
                height: 'auto'
              },
              rest: {
                opacity: 0,
                height: 0
              }
            }}
            transition={{ duration: 0.3 }}
          >
            <Button>{labelAction}</Button>
          </CardHoverOverlay>
        </CardImageContainer>
        <CardText>
          <CardTitle>{title}</CardTitle>
          <CardContent>{content}</CardContent>
          {!isProfile && (
            <div className="text-primary-500 font-semibold text-xs mt-4 text-right">{t('Available NFTs')}</div>
          )}
          <div className="flex justify-between items-center">
            <CardPrice>{isProfile ? `Your balance: ${balance}` : usd(price?.value)}</CardPrice>
            {!isProfile && (
              <div className="text-right">
                {isAvailableLoading ? (
                  <Spinner />
                ) : (
                  <CardPrice>
                    {available}/{amountLimit.value}
                  </CardPrice>
                )}
              </div>
            )}
          </div>
        </CardText>
      </Card>
    </CardContainer>
  );
};
