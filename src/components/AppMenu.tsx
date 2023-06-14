import React, { FC, useState } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Flex,
  Box,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { IDataMenu } from '../utils/utils-app';

interface IAppMenuProps {
  data: IDataMenu[];
  value: string;
  setValue: (value: string) => void;
  minW?: any;
}

const AppMenu: FC<IAppMenuProps> = ({ data, value, setValue, minW }) => {
  const [currentData, setCurrentData] = useState<IDataMenu>(
    data.find((item) => item.value === value) || null!,
  );
  return (
    <Menu>
      <MenuButton w={'full'} px={0} py={0}>
        {!!currentData && (
          <Flex
            align={'center'}
            justify={'center'}
            h={'40px'}
            minW={minW}
            bg={'white'}
            borderRadius={'6px'}
            border={'1px solid #C7D2E1'}
            px={'20px'}
            py={'10px'}
          >
            <Flex align={'center'}>
              {currentData.icon && (
                <Box mr={2} color={'rgba(0, 2, 36, 0.5)'}>
                  {currentData.icon}
                </Box>
              )}
              <Text className={'text-filter'}>{currentData.label}</Text>
            </Flex>
            <Box ml={2}>
              <ChevronDownIcon />
            </Box>
          </Flex>
        )}
      </MenuButton>

      <MenuList minW={'124px'} mt={-2} zIndex={4}>
        {data.map((item, index) => (
          <MenuItem
            key={index}
            px={0}
            py={0}
            onClick={() => {
              setCurrentData(item);
              setValue(item.value);
            }}
          >
            <Flex
              align={'center'}
              h={'40px'}
              minW={minW}
              px={'20px'}
              py={'10px'}
              sx={{
                _hover: {
                  bg: '#0060DB',
                  '& *': {
                    color: 'white !important',
                  },
                },
              }}
            >
              <Flex align={'center'}>
                {item.icon && (
                  <Box mr={2} color={'rgba(0, 2, 36, 0.5)'}>
                    {item.icon}
                  </Box>
                )}
                <Text>{item.label}</Text>
              </Flex>
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default AppMenu;
