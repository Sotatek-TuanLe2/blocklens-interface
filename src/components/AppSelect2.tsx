import React, {
  FC,
  useMemo,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { Box, Flex, LayoutProps } from '@chakra-ui/react';
import 'src/styles/components/AppSelect.scss';

interface IAppSelectPops {
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
}) => {
  const [open, setOpen] = useState<boolean>(false);
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

  return (
    <Box
      className={`app-select ${size} ${className}`}
      width={width}
      ref={ref}
      zIndex={zIndex}
      userSelect={'none'}
    >
      <Flex
        className="app-select__btn-select"
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

        <Box className="icon-arrow-down" ml={2} />
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
    </Box>
  );
};

export default AppSelect2;
