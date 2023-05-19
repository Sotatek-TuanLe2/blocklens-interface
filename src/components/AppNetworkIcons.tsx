import { Box, Flex } from '@chakra-ui/react';
import 'src/styles/components/AppNetworkIcons.scss';
import { getChainIconByChainName } from 'src/utils/utils-network';

interface IAppNetworkIconsProps {
  networkIds: string[];
  showNumber?: number;
  className?: string;
}

const AppNetworkIcons: React.FC<IAppNetworkIconsProps> = (props) => {
  const { networkIds, showNumber, className = '' } = props;

  const showNetworks = [...networkIds];
  if (showNumber && networkIds.length > showNumber) {
    showNetworks.length = showNumber;
  }

  return (
    <Flex alignItems="center" className={`network-icons ${className}`}>
      {showNetworks.map((network, index) => (
        <Box key={index} className="network-icons__item">
          <Box className={getChainIconByChainName(network)}></Box>
        </Box>
      ))}
    </Flex>
  );
};

export default AppNetworkIcons;
