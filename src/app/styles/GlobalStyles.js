import { createGlobalStyle } from 'styled-components';
import { globalStyles } from 'twin.macro';

const GlobalStyles = createGlobalStyle(
  globalStyles,
  `
   /* Below animations are for modal created using React-Modal */
   .ReactModal__Overlay {
    transition: opacity 300ms ease-in-out;
    transition-delay: 100ms;
    opacity: 0;
   }
   .ReactModal__Overlay--after-open{
     opacity: 1;
   }
    .ReactModal__Content {
     transition: transform 300ms ease-in-out;
     transition-delay: 100ms;
     transform: scale(0);
   }
   .ReactModal__Content--after-open{
     transform: scale(1);
   }
   .ReactModal__Content--before-close{
     transform: scale(0);
   }
   button {
    -webkit-tap-highlight-color: transparent;
    outline: 0;
   }
`
);

export default GlobalStyles;
