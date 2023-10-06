import React, { FC, useEffect, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { FilterIcon } from '../assets/icons';
import { AppInput } from './index';

interface IOption {
  value: string;
  label: string;
}

interface IFilter {
  value: string;
  onChange: (value: string) => void;
  type: string;
  options?: IOption[];
}
const AppFilter: FC<IFilter> = ({ value, onChange, type, options }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef<any>(null);

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current?.contains(event.target)) {
      setIsOpen(false);
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
      ml={2}
      className={`filter-table ${isOpen || !!value ? 'active' : ''}`}
      ref={ref}
    >
      <FilterIcon onClick={() => setIsOpen(true)} />

      {isOpen && (
        <>
          {type === 'status' ? (
            <Box className="filter-table__options">
              {!!options &&
                options.map((item: any, index: number) => {
                  return (
                    <Box
                      className={`filter-table__option ${
                        item.value === value ? 'active' : ''
                      }`}
                      onClick={() => {
                        onChange(item?.value);
                        setIsOpen(false);
                      }}
                      key={index}
                    >
                      {item.label}
                    </Box>
                  );
                })}
            </Box>
          ) : (
            <Box className="filter-table__box-search">
              <AppInput
                className={'input-search'}
                value={value}
                onChange={(e) => onChange(e.target.value.trim())}
                placeholder={`Select by ${type}`}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default AppFilter;
