import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
} from '@chakra-ui/react';
import React, { FC, ReactNode } from 'react';
import AppButton from 'src/components/AppButton';
import { ModalProps, ModalHeaderProps } from '@chakra-ui/modal/src/modal';
import { WarningTwoIcon } from '@chakra-ui/icons';

export interface BaseModalProps extends ModalProps {
  title: string;
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
  isWarning?: boolean;
}

const BaseModal: FC<BaseModalProps> = ({
  title,
  isOpen,
  onClose,
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
  isWarning = false,
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
        <ModalContent className={className}>
          <ModalHeader
            sx={{ textAlign: isHideCloseIcon ? 'center' : 'left' }}
            {...styleHeader}
          >
            {isWarning && <WarningTwoIcon mr={2} color={'red'} />} {title}
          </ModalHeader>
          {!isHideCloseIcon && <ModalCloseButton />}

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
