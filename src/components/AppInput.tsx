import { Input, InputProps, InputGroup } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { StyleProps, forwardRef } from '@chakra-ui/system';
import SimpleReactValidator from 'simple-react-validator';
import { useForceRender } from 'src/hooks/useForceRender';
import { ReactNode } from 'react';
import React from 'react';

interface ValidatorProps {
  validator: SimpleReactValidator;
  name: string;
  rule: string | Array<string | { [key: string]: unknown }>;
  options?: { [key: string]: unknown };
}

interface AppInputProps extends InputProps {
  variant?: 'main' | 'auth' | 'authSecondary' | 'search';
  validate?: ValidatorProps;
  readOnly?: boolean;
  endAdornment?: ReactNode;
}

const AppInput = forwardRef(
  ({ variant = 'main', readOnly, validate, ...props }: AppInputProps, ref) => {
    const forceRender = useForceRender();
    const onBlur = () => {
      validate?.validator.showMessageFor(validate.name);
      forceRender();
    };
    return (
      <>
        <InputGroup size="md">
          <Input
            {...props}
            variant={variant}
            onBlur={onBlur}
            ref={ref}
            readOnly={readOnly}
          />
          {props.endAdornment}
        </InputGroup>

        {validate &&
          !readOnly &&
          validate.validator.message(
            validate.name,
            props.value,
            validate.rule,
            validate.options,
          )}
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
        bg: mode('transparent', 'navy.800')(props),
        border: '1px solid',
        color: mode('secondaryGray.900', 'white')(props),
        borderColor: mode('secondaryGray.100', 'whiteAlpha.100')(props),
        borderRadius: '16px',
        fontSize: 'sm',
        p: '20px',
        _placeholder: {
          color: mode('secondaryGray.500', 'whiteAlpha.300')(props),
        },
      },
    }),
    auth: (props: StyleProps) => ({
      field: {
        fontWeight: '500',
        color: mode('navy.700', 'white')(props),
        bg: mode('transparent', 'transparent')(props),
        border: '1px solid',
        borderColor: mode(
          'secondaryGray.100',
          'rgba(135, 140, 189, 0.3)',
        )(props),
        borderRadius: '16px',
        _placeholder: { color: 'secondaryGray.600', fontWeight: '400' },
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
    search: (props: StyleProps) => ({
      field: {
        bg: mode('secondaryGray.300', 'navy.900')(props),
        border: 'none',
        py: '11px',
        borderRadius: '30px',
        _placeholder: { color: 'gray.400', fontSize: '14px' },
        color: mode('gray.700', 'gray.100')(props),
      },
    }),
  },
};
