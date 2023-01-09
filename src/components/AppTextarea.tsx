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
      bg: mode('card.100', 'card.100')(props),
      border: '1px solid',
      color: mode('white', 'white')(props),
      borderColor: mode('line.100', 'line.300')(props),
      borderRadius: '6px',
      fontSize: '16px',
      p: '20px',
      _placeholder: {
        color: mode('line.100', 'line.100')(props),
      },
      _focus: {
        borderColor: mode('pressed.100', 'pressed.100')(props),
      },
    }),
  },
};

export default AppTextarea;
