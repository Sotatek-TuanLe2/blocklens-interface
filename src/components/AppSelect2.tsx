import React, {
  FC,
  useMemo,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { Box, Flex, LayoutProps, Spinner } from '@chakra-ui/react';
import 'src/styles/components/AppSelect.scss';
import SimpleReactValidator from 'simple-react-validator';
import { useForceRender } from 'src/hooks/useForceRender';

interface ValidatorProps {
  validator: SimpleReactValidator;
  name: string;
  rule: string | Array<string | { [key: string]: unknown }>;
  options?: { [key: string]: unknown };
}
interface IAppSelectPops {
  options: IOption[];
  value: string;
  className?: string;
  width?: string;
  size?: 'small' | 'medium' | 'large';
  hiddenLabelDefault?: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  zIndex?: number;
  customItem?: (optionItem: any) => ReactNode;
  sxWrapper?: LayoutProps;
  validate?: ValidatorProps;
  readOnly?: boolean;
  hiddenErrorText?: boolean;
}

interface IOption {
  value: string;
  label: string;
  icon?: string;
}

const AppSelect2: FC<IAppSelectPops> = ({
  options,
  value,
  onChange,
  width,
  size = 'small',
  hiddenLabelDefault = false,
  className,
  disabled,
  zIndex,
  customItem,
  sxWrapper,
  isLoading,
  hiddenErrorText = false,
  validate,
  readOnly,
  ...props
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const forceRender = useForceRender();
  const ref = useRef<any>(null);

  const optionSelected = useMemo(
    () => options.find((item: IOption) => item.value === value),
    [value, options],
  );

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current?.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const onBlur = () => {
    validate?.validator.showMessageFor(validate.name);
    forceRender();
  };

  return (
    <Box
      className={`app-select ${size} ${className}`}
      width={width}
      ref={ref}
      zIndex={zIndex}
      userSelect={'none'}
    >
      <Flex
        className={`app-select__btn-select ${disabled ? 'app-select__btn-select--disabled' : ''}`}
        onClick={() => {
          !disabled && setOpen(!open);
        }}
        {...sxWrapper}
      >
        {customItem && optionSelected ? (
          customItem(optionSelected)
        ) : (
          <Flex alignItems={'center'}>
            {optionSelected?.icon && (
              <Box className={`${optionSelected?.icon} icon`} />
            )}
            {hiddenLabelDefault ? (
              <Box>{optionSelected?.label ?? ''}</Box>
            ) : (
              <Box>{optionSelected?.label ?? '--Select--'}</Box>
            )}
          </Flex>
        )}
        {isLoading ? <Spinner /> : <Box className="icon-arrow-down" ml={2} />}
      </Flex>

      {open && (
        <Box
          className={'app-select__menu'}
          boxShadow={'0px 10px 40px rgba(125, 143, 179, 0.2)'}
        >
          {options.map((option: IOption, index: number) => {
            return (
              <Flex
                key={index}
                className={`app-select__menu-item ${
                  value === option.value ? 'selected' : ''
                }`}
                onBlur={onBlur}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {optionSelected?.icon && (
                  <Box className={`${option?.icon} icon`} />
                )}
                {customItem ? customItem(option) : <Box>{option.label}</Box>}
              </Flex>
            );
          })}
        </Box>
      )}
      <Box>
        {!hiddenErrorText &&
          validate &&
          !readOnly &&
          validate.validator.message(
            validate.name,
            value ? value : ref ? (ref as any).current?.value : '',
            validate.rule,
            validate.options,
          )}
      </Box>
    </Box>
  );
};

export default AppSelect2;
