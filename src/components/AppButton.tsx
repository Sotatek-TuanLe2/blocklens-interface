import React, { forwardRef, useState } from 'react';
import { Button, ButtonProps, Spinner } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { StyleProps } from '@chakra-ui/system';
import { isMobile } from 'react-device-detect';

export interface AppButtonProps extends ButtonProps {
  variant?:
    | 'brand'
    | 'darkBrand'
    | 'lightBrand'
    | 'light'
    | 'action'
    | 'setup'
    | 'outline'
    | 'no-effects'
    | 'cancel'
    | 'red'
    | 'network';
  showSubmitting?: boolean;
}

const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  (props, ref) => {
    const {
      variant = 'brand',
      children,
      showSubmitting = false,
      isDisabled,
      onClick,
      ...rest
    } = props;
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const onClickButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
      if (showSubmitting) {
        setIsSubmitting(true);
      }
      onClick && (await onClick(e));
      setIsSubmitting(false);
    };

    return (
      <Button
        variant={variant}
        ref={ref}
        onClick={onClickButton}
        disabled={isDisabled || isSubmitting}
        {...rest}
      >
        {isSubmitting && <Spinner size={'sm'} mr={2} />}
        {children}
      </Button>
    );
  },
);

export const AppButtonLarge = (props: AppButtonProps) => {
  const {
    children,
    showSubmitting = false,
    isDisabled,
    onClick,
    ...rest
  } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onClickButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (showSubmitting) {
      setIsSubmitting(true);
    }
    onClick && (await onClick(e));
    setIsSubmitting(false);
  };

  return (
    <AppButton
      size={isMobile ? 'sm' : 'lg'}
      px={6}
      onClick={onClickButton}
      isDisabled={isDisabled || isSubmitting}
      {...rest}
    >
      {isSubmitting && <Spinner size={'sm'} mr={2} />}
      {children}
    </AppButton>
  );
};

export default AppButton;

export const appButtonStyles = {
  baseStyle: {
    borderRadius: '6px',
    boxShadow: '45px 76px 113px 7px rgba(112, 144, 176, 0.08)',
    transition: '.25s all ease',
    boxSizing: 'border-box',
    fontWeight: 500,
    _focus: {
      boxShadow: 'none',
    },
    _active: {
      boxShadow: 'none',
    },
  },
  variants: {
    outline: (props: StyleProps) => ({
      borderRadius: '6px',
      bg: 'none',
      color: '#1B75FF',
      fontSize: '16px',
      borderWidth: '1px',
      borderColor: '#1B75FF',
      _hover: {
        bg: mode('main.100', 'main.100')(props),
        color: 'white',
        _disabled: {
          bg: 'none',
          color: 'main.100',
        },
      },
    }),
    brand: (props: StyleProps) => ({
      bg: mode('main.100', 'main.100')(props),
      color: 'white',
      fontSize: '16px',
      _hover: {
        bg: mode('main.400', 'main.400')(props),
        _disabled: {
          bg: mode('rgba(0, 2, 36, 0.1)', 'rgba(0, 2, 36, 0.1)')(props),
          color: 'rgba(0, 2, 36, 0.5)',
        },
      },
      _disabled: {
        color: mode('rgba(0, 2, 36, 0.5)', 'rgba(0, 2, 36, 0.5)')(props),
        bg: mode('rgba(0, 2, 36, 0.1)', 'rgba(0, 2, 36, 0.1)')(props),
      },
    }),
    red: () => ({
      bg: 'red.400',
      color: 'white',
      _hover: {
        bg: 'red.500',
        _disabled: {
          bg: 'red.500',
        },
      },
    }),
    cancel: (props: StyleProps) => ({
      borderRadius: '6px',
      bg: 'white.100',
      fontSize: '16px',
      fontWeight: 500,
      color: 'bg.100',
      borderWidth: '1px',
      borderColor: 'border.400',
      _hover: {
        bg: mode('line.100', 'line.100')(props),
        color: 'white',
        _disabled: {
          bg: 'none',
          color: 'white',
        },
      },
    }),
    network: (props: StyleProps) => ({
      borderRadius: '50px',
      bg: 'none',
      color: '#8D91A5',
      fontSize: '16px',
      borderWidth: '1px',
      borderColor: 'line.100',
      _hover: {
        bg: 'linear-gradient(268.85deg, rgba(34, 108, 255, 0.12) 22.48%, rgba(16, 132, 255, 0.12) 83.59%)',
        color: 'white',
        borderColor: '#1B75FF',
        _disabled: {
          color: 'rgba(0, 2, 36, 0.5)',
          bg: mode('rgba(0, 2, 36, 0.1)', 'rgba(0, 2, 36, 0.1)')(props),
        },
      },
      _disabled: {
        color: mode('rgba(0, 2, 36, 0.5)', 'rgba(0, 2, 36, 0.5)')(props),
        bg: mode('rgba(0, 2, 36, 0.1)', 'rgba(0, 2, 36, 0.1)')(props),
      },
    }),
    active: (props: StyleProps) => ({
      bg: 'linear-gradient(268.85deg, rgba(34, 108, 255, 0.12) 22.48%, rgba(16, 132, 255, 0.12) 83.59%)',
      color: 'white',
      borderColor: '#1B75FF',
      _disabled: {
        color: 'rgba(0, 2, 36, 0.5)',
        bg: mode('rgba(0, 2, 36, 0.1)', 'rgba(0, 2, 36, 0.1)')(props),
      },
    }),
  },
};
