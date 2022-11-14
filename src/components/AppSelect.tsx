import React, { FC } from 'react';
import { Avatar, Box, Flex, SelectProps } from '@chakra-ui/react';
import Select, { components } from 'react-select';

interface AppSelectPops extends SelectProps {
  defaultValue?: any;
  options: any;
  isSearchable?: boolean;
}

export interface IOption {
  value: string;
  label: string;
  icon?: string;
}

const { Option } = components;
const IconOption = (props: any) => (
  <Option {...props}>
    <Flex cursor={'pointer'} alignItems={'center'}>
      {props.data.icon && <Box className={`${props.data.icon}`} mr={2} />}
      {/* {props.data.icon && <Avatar src={props.data.icon} size="xs" mr={2} />} */}
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
        <Flex alignItems={'center'}>
          {e?.icon && <Flex className={`${e?.icon}`} mr={2} />}
          {/* {e?.icon && <Avatar src={e?.icon} size="xs" mr={2} />} */}
          {e.label}
        </Flex>
      )}
      options={options}
      components={{ Option: IconOption }}
      classNamePrefix="select-app"
    />
  );
};

export default AppSelect;
