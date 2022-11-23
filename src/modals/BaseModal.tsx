import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Box,
} from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import AppButton from 'src/components/AppButton';
import { ModalProps, ModalHeaderProps } from '@chakra-ui/modal/src/modal';
import 'src/styles/components/BaseModal.scss';
import { CloseIcon } from '@chakra-ui/icons';

export interface BaseModalProps extends ModalProps {
  title: string;
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
  onActionLeft?: () => void;
  onActionRight?: () => void;
  textActionLeft?: string;
  textActionRight?: string | ReactNode;
  className?: string;
  isLoadingButtonRight?: boolean;
  styleHeader?: ModalHeaderProps;
  icon?: string;
}

const BaseModal: FC<BaseModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  icon,
  size = 'md',
  isCentered = true,
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
              <CloseIcon />
            </Box>
          )}

          {icon && (
            <Box className={`modal__icon ${icon}`} />
          )}

          <Box className={`modal__title ${icon ? 'icon' : ''}`} {...styleHeader}>
            {title}
          </Box>

          {description && (
            <Box className={'modal__description'}>{description}</Box>
          )}

          <ModalBody>{children}</ModalBody>

          <ModalFooter>
            {onActionLeft && (
              <Box mr={2}>
                <AppButton
                  onClick={onActionLeft}
                  variant="outline"
                  fontWeight={400}
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
              >
                {textActionRight}
              </AppButton>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BaseModal;
