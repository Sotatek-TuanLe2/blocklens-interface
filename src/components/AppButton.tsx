import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { StyleProps } from '@chakra-ui/system';

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
    | 'red';
}

const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  (props, ref) => {
    const { variant = 'brand', children, ...rest } = props;
    return (
      <Button {...rest} variant={variant} ref={ref}>
        {children}
      </Button>
    );
  },
);

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
      color: 'main.100',
      borderWidth: '1px',
      borderColor: 'main.100',
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
        bg: mode('pressed.100', 'pressed.100')(props),
        _disabled: {
          bg: mode('line.100', 'line.100')(props),
        },
      },
      _disabled: {
        bg: mode('line.100', 'line.100')(props),
      },
    }),
    red: (props: StyleProps) => ({
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
      bg: 'none',
      fontSize: '16px',
      fontWeight: 500,
      color: 'white',
      borderWidth: '1px',
      borderColor: 'line.100',
      _hover: {
        bg: mode('line.100', 'line.100')(props),
        color: 'white',
        _disabled: {
          bg: 'none',
          color: 'white',
        },
      },
    }),
  },
};
