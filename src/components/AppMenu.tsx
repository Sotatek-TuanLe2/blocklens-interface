import React, { FC, ReactNode } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Flex,
  Button,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

interface IDataMenu {
  value: ReactNode;
  icon: ReactNode;
  label: ReactNode;
}

interface IAppMenuProps {
  data: IDataMenu[];
  value: IDataMenu;
  setValue: (value: IDataMenu) => void;
}

const AppMenu: FC<IAppMenuProps> = ({ data, value, setValue }) => {
  return (
    <Menu>
      <MenuButton
        w={'full'}
        display={'flex'}
        alignItems={'center'}
        justify={'center'}
        h={10}
        minW={'124px'}
        bg={'white'}
        border={'1px solid #C7D2E1'}
        borderRadius={'6px'}
        as={Button}
        rightIcon={<ChevronDownIcon />}
      >
        <Flex align={'center'}>
          {value.icon}
          <Text px={2}>{value.label}</Text>
        </Flex>
      </MenuButton>

      <MenuList minW={'124px'} mt={-2} zIndex={4}>
        {data.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => setValue(item)}
            px={5}
            h={8}
            _hover={{ bg: '#0060DB', color: 'white' }}
            transition={'.2s linear'}
          >
            <Flex align={'center'}>
              {item.icon}
              <Text px={2}>{item.label}</Text>
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default AppMenu;
