import tw from 'twin.macro';
import 'styled-components/macro';
import styled, { keyframes } from 'styled-components';
import { ModalBase, ModalOverlay } from './ModalBase';
import React from 'react';
import { ReactComponent as CloseIcon } from 'feather-icons/dist/icons/x.svg';
import { ButtonBase } from '../Buttons';

const appearAnimation = keyframes`
  from {
    transform: scale(1.2);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const ModalTitle = styled.div`
  font-weight: 700;
  font-size: 22px;
  letter-spacing: -0.01em;
  padding: 15px;
`;

const ButtonClose = styled(ButtonBase)`
  font-size: 7px;
  position: absolute;
  right: 15px;
  top: 20px;
  z-index: 1;
`;

export const Modal = styled(({ className, children, title, onClose, ...baseProps }) => {
  return (
    <ModalBase {...baseProps} className={className} css={tw`flex flex-col`}>
      <div>
        {!!title && <ModalTitle>{title}</ModalTitle>}
        <ButtonClose onClick={onClose}>
          <CloseIcon />
        </ButtonClose>
      </div>
      <div css={tw`grow overflow-auto`}>{children}</div>
    </ModalBase>
  );
})`
  position: relative;
  border-radius: 1.5rem;
  background: white;
  z-index: 100;
  min-width: 320px;
`;

const Overlay = styled(ModalOverlay)`
  background-color: rgba(3, 6, 12, 0.85);
  animation: ${appearAnimation} 0.3s;
  cursor: ${(props) => (props.onClick ? 'pointer' : '')};
`;

Modal.defaultProps = {
  Overlay
};
