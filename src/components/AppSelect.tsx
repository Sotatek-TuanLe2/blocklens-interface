import React, { FC } from 'react';
import { Box, Flex, SelectProps } from '@chakra-ui/react';
import Select, { components } from 'react-select';
import 'src/styles/components/AppSelect.scss';

interface AppSelectPops extends SelectProps {
  defaultValue?: any;
  options: any;
  isSearchable?: boolean;
}

export interface IOption {
  value: string;
  label: string;
  icon?: string | JSX.Element | any;
}

const { Option } = components;
const IconOption = (props: any) => (
  <Option {...props}>
    <Flex cursor={'pointer'} alignItems={'center'}>
      {props.data.icon && <Box className={`${props.data.icon} label`} mr={2} />}
      {props.data.label}
    </Flex>
  </Option>
);

const AppSelect: FC<AppSelectPops> = ({
  defaultValue,
  options,
  isSearchable = false,
  children,
  ...props
}: AppSelectPops) => {
  return (
    <Select
      {...props}
      isSearchable={isSearchable}
      defaultValue={defaultValue}
      // @ts-ignore
      getOptionLabel={(e: IOption) => (
        <Flex alignItems={'center'} className={'label-option'}>
          {e?.icon && <Flex className={`${e?.icon}`} />}
          <Box ml={2}> {e.label}</Box>
        </Flex>
      )}
      options={options}
      components={{ Option: IconOption }}
      classNamePrefix="select-app"
    />
  );
};

export default AppSelect;
