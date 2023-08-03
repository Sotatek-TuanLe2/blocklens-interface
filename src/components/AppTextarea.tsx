import { FC, useEffect, useRef, useState } from 'react';
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
  autoResize?: boolean;
}

const AppTextarea: FC<AppTextareaProps> = ({
  variant = 'main',
  validate,
  hiddenErrorText = false,
  autoResize = false,
  ...props
}) => {
  const forceRender = useForceRender();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [height, setHeight] = useState('auto');

  const handleResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      setHeight(`${textarea.scrollHeight}px`);
    }
  };

  useEffect(() => {
    handleResize();
  }, [props.value]);

  const onBlur = () => {
    validate?.validator.showMessageFor(validate.name);
    forceRender();
  };
  return (
    <>
      {autoResize ? (
        <Textarea
          variant={variant}
          onBlur={onBlur}
          ref={textareaRef}
          style={{ height }}
          {...props}
        />
      ) : (
        <Textarea variant={variant} onBlur={onBlur} {...props} />
      )}
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
      bg: mode('white', 'white')(props),
      border: '1px solid',
      color: mode('#000224', '#000224')(props),
      borderColor: mode('#C7D2E1', '#C7D2E1')(props),
      borderRadius: '6px',
      fontSize: '16px',
      p: '20px',
      _placeholder: {
        color: mode('#C7D2E1', '#C7D2E1')(props),
      },
      _focus: {
        borderColor: mode('pressed.100', 'pressed.100')(props),
      },
    }),
  },
};

export default AppTextarea;
