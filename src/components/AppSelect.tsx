import React, { FC } from 'react';
import { Avatar, Flex, SelectProps } from '@chakra-ui/react';
import Select, { components } from 'react-select';

interface AppSelectPops extends SelectProps {
  defaultValue?: any;
  options: any;
}

export interface IOption {
  value: string;
  label: string;
  icon?: string
}

const { Option } = components;
const IconOption = (props: any) => (
  <Option {...props}>
    <Flex cursor={'pointer'}>
      {props.data.icon && <Avatar src={props.data.icon} size="xs" mr={2} />}
      {props.data.label}
    </Flex>
  </Option>
);

const AppSelect: FC<AppSelectPops> = ({
  defaultValue,
  options,
  children,
  ...props
}: AppSelectPops) => {
  return (
    <Select
      {...props}
      isSearchable={false}
      defaultValue={defaultValue}
      // @ts-ignore
      getOptionLabel={(e: IOption) => (
        <Flex>
          {e?.icon && <Avatar src={e?.icon} size="xs" mr={2} />}
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