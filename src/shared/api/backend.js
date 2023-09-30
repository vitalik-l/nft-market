import { STRAPI_URL } from '../config';
import Strapi from 'strapi-sdk-js';

const strapi = new Strapi({ url: STRAPI_URL });

export const getContent = (obj) => obj?.attributes?.contents?.data?.[0]?.attributes;

export const getMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) {
    return url;
  }
  return `${STRAPI_URL}${url}`;
};

const getChain = async () => {
  const resp = await strapi.find('chains', {
    populate: 'config',
    filters: {
      enabled: {
        $eq: true
      }
    }
  });
  return resp?.data?.[0];
};

const getCategories = async ({ locale, chainEntityId }) => {
  return strapi.find('categories', {
    populate: {
      contents: {
        filters: {
          locale: { $eq: locale }
        }
      },
      items: {
        filters: {
          chain: {
            id: {
              $eq: chainEntityId
            }
          }
        },
        populate: {
          image: '*',
          media: '*',
          modelFile: '*',
          contents: {
            filters: {
              locale: { $eq: locale }
            }
          }
        }
      }
    }
  });
};

export const backendApi = {
  getChain,
  getCategories
};
