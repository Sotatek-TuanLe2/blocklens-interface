import { Box, Flex } from '@chakra-ui/react';
import {
  getLogoChainByChainId,
  getNameChainByChainId,
} from 'src/utils/utils-network';
import React, { FC } from 'react';

interface IAppChainNetwork {
  chain: string;
  network: string;
}

const AppChainNetwork: FC<IAppChainNetwork> = ({ chain, network }) => {
  return (
    <Flex alignItems={'center'}>
      <Box className={getLogoChainByChainId(chain) || ''} mr={2.5} />
      <Box mr={1}>{getNameChainByChainId(chain)}</Box>
      <Box textTransform="capitalize"> {network.toLowerCase()}</Box>
    </Flex>
  );
};

export default AppChainNetwork;
