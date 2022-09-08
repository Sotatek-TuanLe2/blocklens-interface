import { FC } from 'react';
import { Select, SelectProps } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { StyleProps } from '@chakra-ui/system';

interface AppSelectPops extends SelectProps {
  variant?:
    | 'main'
    | 'mini'
    | 'subtle'
    | 'transparent'
    | 'auth'
    | 'authSecondary'
    | 'search';
  size?: 'sm' | 'md';
}

const AppSelect: FC<AppSelectPops> = ({
  variant = 'main',
  size = 'md',
  children,
  ...props
}: AppSelectPops) => {
  return (
    <Select variant={variant} size={size} {...props}>
      {children}
    </Select>
  );
};

export default AppSelect;

export const appSelectStyles = {
  baseStyle: {
    field: {
      fontWeight: 400,
      cursor: 'pointer',
    },
  },
  sizes: {
    sm: {
      height: '40px',
    },
    md: {
      height: '42px',
    },
  },
  variants: {
    main: (props: StyleProps) => ({
      field: {
        bg: mode('transparent', 'navy.800')(props),
        border: '1px solid',
        color: mode('secondaryGray.900', 'white')(props),
        borderColor: mode('secondaryGray.100', 'whiteAlpha.100')(props),
        borderRadius: '16px',
        _placeholder: { color: 'secondaryGray.600' },
      },
      icon: {
        color: 'secondaryGray.600',
      },
    }),
    mini: (props: StyleProps) => ({
      field: {
        bg: mode('transparent', 'navy.800')(props),
        border: '0px solid transparent',
        fontSize: '0px',
        p: '10px',
        _placeholder: { color: 'secondaryGray.600' },
      },
      icon: {
        color: 'secondaryGray.600',
      },
    }),
    subtle: () => ({
      box: {
        width: 'unset',
      },
      field: {
        bg: 'transparent',
        border: '0px solid',
        color: 'secondaryGray.600',
        borderColor: 'transparent',
        width: 'max-content',
        _placeholder: { color: 'secondaryGray.600' },
      },
      icon: {
        color: 'secondaryGray.600',
      },
    }),
    transparent: (props: StyleProps) => ({
      field: {
        bg: 'transparent',
        border: '0px solid',
        width: 'min-content',
        color: mode('secondaryGray.600', 'secondaryGray.600')(props),
        borderColor: 'transparent',
        padding: '0px',
        paddingLeft: '8px',
        paddingRight: '20px',
        fontWeight: '700',
        fontSize: '14px',
        _placeholder: { color: 'secondaryGray.600' },
      },
      icon: {
        transform: 'none !important',
        position: 'unset !important',
        width: 'unset',
        color: 'secondaryGray.600',
        right: '0px',
      },
    }),
    auth: () => ({
      field: {
        bg: 'transparent',
        border: '1px solid',

        borderColor: 'secondaryGray.100',
        borderRadius: '16px',
        _placeholder: { color: 'secondaryGray.600' },
      },
    }),
    authSecondary: () => ({
      field: {
        bg: 'transparent',
        border: '1px solid',

        borderColor: 'secondaryGray.100',
        borderRadius: '16px',
        _placeholder: { color: 'secondaryGray.600' },
      },
    }),
    search: () => ({
      field: {
        border: 'none',
        py: '11px',
        borderRadius: 'inherit',
        _placeholder: { color: 'secondaryGray.600' },
      },
    }),
  },
};
