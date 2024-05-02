import React from 'react';
import { motion } from 'framer-motion';
import tw from 'twin.macro';
import 'styled-components/macro';
import styled from 'styled-components';
import { Container, ContentWithPaddingXl } from 'shared/ui-kit/components/misc/Layouts.js';
import { SectionHeading } from 'shared/ui-kit/components/misc/Headings.js';
import { ReactComponent as SvgDecoratorBlob1 } from 'shared/ui-kit/images/svg-decorator-blob-5.svg';
import { ReactComponent as SvgDecoratorBlob2 } from 'shared/ui-kit/images/svg-decorator-blob-7.svg';
import { NftCard } from 'entities/collections/ui';
import { Spinner } from '../../shared/ui-kit';
import { Link } from 'react-router-dom';
import { useGate, useUnit } from 'effector-react';
import { collectionsModel } from '../../entities/collections';
import { SortingSelect } from './SortingSelect';
import { useTranslation } from 'react-i18next';
import { PrimaryButton } from '../../shared/ui-kit/components/misc/Buttons';
import { nftCardsModel } from './model';
import { getContent } from '../../shared/api/backend';

const HeaderRow = tw.div`flex justify-between items-center flex-col xl:flex-row gap-4`;
const Header = tw(SectionHeading)``;
const TabsControl = tw.div`grid w-full sm:w-auto sm:flex flex-wrap px-2 py-2 rounded-3xl leading-none xl:mt-0`;

const TabControl = styled.div`
  ${tw`border-2 border-transparent rounded-3xl capitalize cursor-pointer px-6 py-3 mt-2 sm:mt-0 sm:mr-2 last:mr-0 text-gray-900 font-medium transition duration-300 text-base sm:w-auto text-center`}
  &:hover {
    ${tw`text-gray-700`}
  }

  ${(props) => props.$active && tw`border-primary-500!`}
}
`;

const TabContent = tw(motion.div)`mt-6 flex flex-wrap sm:-mr-10 md:-mr-6 lg:-mr-12`;

const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none -z-20 absolute right-0 top-0 h-64 w-64 opacity-15 transform translate-x-2/3 -translate-y-12 text-pink-400`}
`;
const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`pointer-events-none -z-20 absolute left-0 bottom-0 h-80 w-80 opacity-15 transform -translate-x-2/3 text-primary-500`}
`;

export default ({ heading = 'Checkout the Menu', activeTab, asLink = false, onChange }) => {
  const { t } = useTranslation();
  useGate(nftCardsModel.NftCardsGate, { activeTab });
  const items = useUnit(nftCardsModel.$sortedItems);
  const pending = false;
  const categories = useUnit(collectionsModel.$categories);

  return (
    <Container>
      <ContentWithPaddingXl>
        <HeaderRow>
          {/*<Header>{heading}</Header>*/}
          {!!categories?.length ? (
            <TabsControl>
              {categories.map((category) => (
                <TabControl
                  key={category.id}
                  $active={activeTab === category.attributes.slug}
                  onClick={asLink ? undefined : () => onChange?.(category.attributes.slug)}
                  as={asLink ? Link : undefined}
                  to={asLink ? `/category/${category.attributes.slug}` : undefined}
                >
                  {getContent(category)?.name}
                </TabControl>
              ))}
            </TabsControl>
          ) : <div />}
          <SortingSelect />
        </HeaderRow>
        {!pending &&
          categories.map((category) => (
            <TabContent
              key={category.id}
              variants={{
                current: {
                  opacity: 1,
                  scale: 1,
                  display: 'flex'
                },
                hidden: {
                  opacity: 0,
                  scale: 0.8,
                  display: 'none'
                }
              }}
              transition={{ duration: 0.4 }}
              initial={activeTab === category.attributes?.slug ? 'current' : 'hidden'}
              animate={activeTab === category.attributes?.slug ? 'current' : 'hidden'}
            >
              {items?.length ? (
                items?.map((address) => <NftCard key={address} address={address} />)
              ) : (
                <div tw="m-auto">{t('There are no items yet')}</div>
              )}
            </TabContent>
          ))}
        {pending && (
          <div css={tw`flex justify-center items-center mt-[80px]`}>
            <Spinner css={tw`text-[60px]`} />
          </div>
        )}
      </ContentWithPaddingXl>
      <DecoratorBlob1 />
      <DecoratorBlob2 />
    </Container>
  );
};
