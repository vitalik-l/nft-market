import { useEffect } from 'react';

export const useScrollLock = ({ open, disableScrollLock }) => {
  useEffect(() => {
    let updated = false;
    if (open && !disableScrollLock && document.body.style.overflow !== 'hidden') {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.left = '0';
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      // trick for IOS safari
      document.documentElement.style.height = `${window.innerHeight - 1}px`;

      if (scrollbarWidth) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      updated = true;
    }

    return () => {
      if (updated) {
        const top = Number(document.body.style.top?.replace('px', ''));
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        document.body.style.position = '';
        document.body.style.left = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.documentElement.style.height = '';
        window.scrollTo(0, Math.abs(top));
      }
    };
  }, [open, disableScrollLock]);
};
