import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useScrollLock } from '../../../helpers/useScrollLock';

export const ModalOverlay = styled.div`
  box-sizing: content-box;
  position: ${(props) => (props.fixed ? 'fixed' : 'absolute')};
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(106, 106, 108, 0.8);
  overflow: auto;
  z-index: 99;
`;

const ModalWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Root = styled.div`
  cursor: initial;
  position: relative;
  z-index: 1;
  margin: auto;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
`;

const onModalClick = (event) => {
  event.preventDefault();
  event.stopPropagation();
};

export const ModalBase = (props) => {
  const {
    className,
    children,
    onOverlayClick,
    Overlay = ModalOverlay,
    open,
    disablePortal,
    container = document.body,
    fixed = true
  } = props;

  useScrollLock({ open });

  const content = open ? (
    <Overlay fixed={fixed} onClick={onOverlayClick}>
      <ModalWrapper>
        <Root className={className} onClick={onOverlayClick ? onModalClick : undefined}>
          {children}
        </Root>
      </ModalWrapper>
    </Overlay>
  ) : null;

  if (!disablePortal) {
    return createPortal(content, container);
  }

  return content;
};
