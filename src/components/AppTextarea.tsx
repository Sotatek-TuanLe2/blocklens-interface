import { FC } from 'react';
import { StyleProps, Textarea, TextareaProps } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import SimpleReactValidator from 'simple-react-validator';
import { useForceRender } from 'src/hooks/useForceRender';

interface ValidatorProps {
  validator: SimpleReactValidator;
  name: string;
  rule: string | Array<string | { [key: string]: unknown }>;
  options?: { [key: string]: unknown };
}

interface AppTextareaProps extends TextareaProps {
  variant?: 'main' | 'auth' | 'authSecondary' | 'search';
  validate?: ValidatorProps;
  hiddenErrorText?: boolean;
}

const AppTextarea: FC<AppTextareaProps> = ({
  variant = 'main',
  validate,
  hiddenErrorText = false,
  ...props
}) => {
  const forceRender = useForceRender();
  const onBlur = () => {
    validate?.validator.showMessageFor(validate.name);
    forceRender();
  };
  return (
    <>
      <Textarea variant={variant} onBlur={onBlur} {...props} />
      {!hiddenErrorText &&
        validate &&
        validate.validator.message(
          validate.name,
          props.value,
          validate.rule,
          validate.options,
        )}
    </>
  );
};

export const appTextareaStyles = {
  baseStyle: {
    fontWeight: 400,
    borderRadius: '8px',
    resize: 'none',
  },

  variants: {
    main: (props: StyleProps) => ({
      bg: mode('transparent', 'navy.800')(props),
      border: '1px solid',
      color: mode('secondaryGray.900', 'white')(props),
      borderColor: mode('secondaryGray.100', 'whiteAlpha.100')(props),
      borderRadius: '4px',
      fontSize: 'sm',
      p: '20px',
      _placeholder: {
        color: mode('secondaryGray.500', 'whiteAlpha.300')(props),
      },
    }),
    auth: () => ({
      bg: 'white',
      border: '1px solid',
      borderColor: 'secondaryGray.100',
      borderRadius: '16px',
      _placeholder: { color: 'secondaryGray.600' },
    }),
    authSecondary: () => ({
      bg: 'white',
      border: '1px solid',

      borderColor: 'secondaryGray.100',
      borderRadius: '16px',
      _placeholder: { color: 'secondaryGray.600' },
    }),
    search: () => ({
      border: 'none',
      py: '11px',
      borderRadius: 'inherit',
      _placeholder: { color: 'secondaryGray.600' },
    }),
  },
};

export default AppTextarea;
