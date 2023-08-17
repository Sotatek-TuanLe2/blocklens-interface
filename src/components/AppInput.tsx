import {
  Input,
  InputProps,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Box,
} from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { StyleProps, forwardRef } from '@chakra-ui/system';
import SimpleReactValidator from 'simple-react-validator';
import { useForceRender } from 'src/hooks/useForceRender';
import { ReactNode, useState } from 'react';
import React from 'react';

interface ValidatorProps {
  validator: SimpleReactValidator;
  name: string;
  rule: string | Array<string | { [key: string]: unknown }>;
  options?: { [key: string]: unknown };
}

interface AppInputProps extends InputProps {
  variant?: 'main' | 'auth' | 'authSecondary' | 'search' | 'searchFilter';
  validate?: ValidatorProps;
  readOnly?: boolean;
  size?: string;
  type?: string;
  isSearch?: boolean;
  endAdornment?: ReactNode;
  hiddenErrorText?: boolean;
}

const AppInput = forwardRef<AppInputProps, any>(
  (
    {
      variant = 'main',
      size = 'lg',
      readOnly,
      type = 'text',
      isSearch = false,
      validate,
      endAdornment,
      hiddenErrorText = false,
      className = '',
      ...props
    },
    ref,
  ) => {
    const forceRender = useForceRender();
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

    const onBlur = () => {
      validate?.validator.showMessageFor(validate.name);
      forceRender();
    };

    return (
      <>
        <InputGroup size={size}>
          {isSearch && (
            <InputLeftElement
              top={'-4px'}
              left={'5px'}
              children={<Box className="icon-search" />}
            />
          )}
          <Input
            type={type === 'password' && isShowPassword ? 'text' : type}
            {...props}
            className={`${className} ${
              type === 'password' ? 'input-password' : ''
            }`}
            variant={variant}
            onBlur={onBlur}
            ref={ref}
            readOnly={readOnly}
          />

          {endAdornment && <InputRightElement children={endAdornment} />}
          {type === 'password' && (
            <InputRightElement
              onClick={() => setIsShowPassword(!isShowPassword)}
              children={
                <Box
                  cursor={'pointer'}
                  className={`${
                    isShowPassword ? 'icon-eye' : 'icon-eye-close'
                  }`}
                />
              }
            />
          )}
        </InputGroup>
        <Box>
          {!hiddenErrorText &&
            validate &&
            !readOnly &&
            validate.validator.message(
              validate.name,
              props.value
                ? props.value
                : ref
                ? (ref as any).current?.value
                : '',
              validate.rule,
              validate.options,
            )}
        </Box>
      </>
    );
  },
);

export default AppInput;

export const appInputStyles = {
  baseStyle: {
    field: {
      fontWeight: 400,
      borderRadius: '8px',
      '::-webkit-calendar-picker-indicator': {
        width: '20px',
        height: '20px',
      },
    },
  },
  variants: {
    main: (props: StyleProps) => ({
      field: {
        bg: mode('white.100', 'card.100')(props),
        border: '1px solid',
        color: mode('black', 'white')(props),
        borderColor: mode('border.400', 'line.300')(props),
        borderRadius: '6px',
        fontSize: '16px',
        p: '20px',
        _focus: {
          borderColor: mode('#0060DB', '#0060DB')(props),
        },
        _placeholder: {
          color: mode('line.100', 'line.100')(props),
        },
        _disabled: {
          bg: mode('rgba(0, 2, 36, 0.05)', 'rgba(0, 2, 36, 0.05)')(props),
          border: 0,
          color: mode('paragraph.100', 'paragraph.100')(props),
        },
      },
    }),
    auth: (props: StyleProps) => ({
      field: {
        fontWeight: '500',
        color: mode('navy.700', 'white')(props),
        bg: mode('transparent', 'transparent')(props),
        border: '1px solid',
        _focus: {
          borderColor: mode('#0060DB', '#0060DB')(props),
        },
        borderColor: mode(
          'secondaryGray.100',
          'rgba(135, 140, 189, 0.3)',
        )(props),
        borderRadius: '4px',
        _placeholder: { color: 'line.100', fontWeight: '400' },
      },
    }),
    authSecondary: () => ({
      field: {
        bg: 'transparent',
        border: '1px solid',
        borderColor: 'secondaryGray.100',
        borderRadius: '4px',
        _placeholder: { color: 'secondaryGray.600' },
      },
    }),
    search: (props: StyleProps) => ({
      field: {
        bg: mode('secondaryGray.300', 'navy.900')(props),
        border: 'none',
        py: '11px',
        borderRadius: '30px',
        _placeholder: { color: 'line.100', fontSize: '14px' },
        color: mode('gray.700', 'gray.100')(props),
      },
    }),
    searchFilter: (props: StyleProps) => ({
      field: {
        bg: mode('white', 'card.100')(props),
        border: '1px solid',
        color: mode('black', 'white')(props),
        borderColor: mode('line.100', 'line.300')(props),
        borderRadius: '6px',
        fontSize: '16px',
        p: '20px 20px 20px 46px',
        _focus: {
          borderColor: mode('#0060DB', '#0060DB')(props),
        },
        _placeholder: {
          color: mode('line.100', 'line.100')(props),
        },
        _disabled: {
          bg: mode('bg.200', 'bg.200')(props),
          borderColor: mode('bg.200', 'bg.200')(props),
          color: mode('paragraph.100', 'paragraph.100')(props),
        },
      },
    }),
  },
};
