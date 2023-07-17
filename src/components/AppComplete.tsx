import React, {
  FC,
  useMemo,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { Box, Flex, LayoutProps, Input } from '@chakra-ui/react';
import 'src/styles/components/AppComplete.scss';
import { upperCase } from 'lodash';

interface IAppCompletePops {
  options: IOption[];
  value: string;
  className?: string;
  width?: string;
  size?: 'small' | 'medium' | 'large';
  hiddenLabelDefault?: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  zIndex?: number;
  customItem?: (optionItem: any) => ReactNode;
  sxWrapper?: LayoutProps;
  extraFooter?: () => ReactNode;
}

interface IOption {
  value: string;
  label: string;
  icon?: string;
}

const AppComplete: FC<IAppCompletePops> = ({
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
  extraFooter,
  sxWrapper,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const ref = useRef<any>(null);

  const optionSelected = useMemo(
    () => options.find((item: IOption) => item.value === value),
    [value, options],
  );

  const optionFilter = useMemo(
    () =>
      options.filter((item: IOption) =>
        upperCase(item.value).includes(upperCase(inputValue)),
      ),
    [inputValue, options],
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

  useEffect(() => {
    if (optionSelected) {
      setInputValue(optionSelected?.label);
    }
  }, [optionSelected]);

  return (
    <Box
      className={`app-complete ${size} ${className}`}
      width={width}
      ref={ref}
      zIndex={zIndex}
      userSelect={'none'}
    >
      <Flex
        className="app-complete__btn-complete"
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
            <Input
              flex={1}
              variant="unstyled"
              value={inputValue}
              borderRadius={0}
              placeholder="--Select--"
              onChange={(e) => setInputValue(e.target.value)}
            />
            {/* {hiddenLabelDefault ? (
              <Box>{optionSelected?.label ?? ''}</Box>
            ) : (
              <Box>{optionSelected?.label ?? '--Select--'}</Box>
            )} */}
          </Flex>
        )}

        <Box className="icon-arrow-down" ml={2} />
      </Flex>
      {open && (
        <Box
          className="app-complete__menu"
          position={'absolute'}
          boxShadow={'0px 10px 40px rgba(125, 143, 179, 0.2)'}
        >
          <Box className={'app-complete__menu-content'}>
            {optionFilter.map((option: IOption, index: number) => {
              return (
                <Flex
                  key={index}
                  className={`app-complete__menu-item ${
                    value === option.value ? 'completeed' : ''
                  }`}
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
          {extraFooter?.()}
        </Box>
      )}
    </Box>
  );
};

export default AppComplete;
