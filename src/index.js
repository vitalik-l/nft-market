import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import Modal from 'react-modal';
import { initWeb3Api } from './shared/api/web3';
import { appReady } from './app/model';
import { i18NextInit } from './shared/i18n';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

i18NextInit();
initWeb3Api();
appReady();

Modal.setAppElement('#root');

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
