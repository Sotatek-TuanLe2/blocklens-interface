import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Box,
  Flex,
} from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import AppButton from 'src/components/AppButton';
import { ModalProps, ModalHeaderProps } from '@chakra-ui/modal/src/modal';
import 'src/styles/components/BaseModal.scss';
import { CloseIcon } from '@chakra-ui/icons';
import { isMobile } from 'react-device-detect';
import { ArrowDown } from 'src/assets/icons';

export interface BaseModalProps extends ModalProps {
  title?: ReactNode | string;
  description?: string;
  size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | 'full';
  isCentered?: boolean;
  isHideCloseIcon?: boolean;
  closeOnOverlayClick?: boolean;
  onActionLeft?: () => void | Promise<void>;
  onActionRight?: () => void | Promise<void>;
  textActionLeft?: string;
  textActionRight?: string | ReactNode;
  className?: string;
  isLoadingButtonRight?: boolean;
  styleHeader?: ModalHeaderProps;
  icon?: string;
  isFullScreen?: boolean;
  isBack?: boolean;
}

const BaseModal: FC<BaseModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  icon,
  size = 'lg',
  isCentered = true,
  isBack = false,
  isHideCloseIcon = false,
  children,
  onActionLeft,
  textActionLeft = 'Cancel',
  onActionRight,
  textActionRight = 'Confirm',
  isLoadingButtonRight = false,
  closeOnOverlayClick = false,
  className,
  styleHeader,
}) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={size}
        isCentered={isCentered}
        closeOnOverlayClick={closeOnOverlayClick}
        autoFocus={false}
      >
        <ModalOverlay />
        <ModalContent className={`${className} modal`}>
          {!isHideCloseIcon && (
            <Box className={'modal__btn-close'} onClick={onClose}>
              <CloseIcon width={isMobile ? '11px' : '15px'} />
            </Box>
          )}

          <Flex flexDirection={'column'} className={'content-modal'}>
            {icon && <Box className={`modal__icon ${icon}`} />}

            {title && (
              <Box
                className={`modal__title ${icon ? 'icon' : ''}`}
                {...styleHeader}
              >
                {isBack && (
                  <Box onClick={onClose} className="icon-back">
                    <ArrowDown />
                  </Box>
                )}
                {title}
              </Box>
            )}

            {description && (
              <Box className={'modal__description'}>{description}</Box>
            )}

            <ModalBody>{children}</ModalBody>

            <ModalFooter>
              {onActionLeft && (
                <Box mr={2}>
                  <AppButton
                    onClick={onActionLeft}
                    variant="cancel"
                    fontWeight={400}
                    size="lg"
                  >
                    {textActionLeft}
                  </AppButton>
                </Box>
              )}

              {onActionRight && (
                <AppButton
                  isLoading={isLoadingButtonRight}
                  onClick={onActionRight}
                  fontWeight={400}
                  size="lg"
                >
                  {textActionRight}
                </AppButton>
              )}
            </ModalFooter>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BaseModal;
