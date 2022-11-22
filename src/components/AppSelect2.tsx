import React, { FC, useMemo,useEffect,  useRef, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import 'src/styles/components/AppSelect.scss';

interface IAppSelectPops {
  options: IOption[];
  value: string;
  width?: string;
  size?: 'small' | 'medium' | 'large';
  onChange: (value: string) => void;
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
    <Box className={`app-select ${size}`} width={width} ref={ref}>
      <Flex className="app-select__btn-select" onClick={() => setOpen(!open)}>
        <Flex alignItems={'center'}>
          {optionSelected?.icon && <Box className={`${optionSelected?.icon} icon`} />}
          <Box>{optionSelected?.label ?? 'Select'}</Box>
        </Flex>

        <Box className="icon-arrow-down" ml={2} />
      </Flex>
      {open && (
        <Box className={'app-select__menu'}>
          {options.map((option: IOption) => {
            return (
              <Flex
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
                <Box>{option.label}</Box>
              </Flex>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default AppSelect2;
