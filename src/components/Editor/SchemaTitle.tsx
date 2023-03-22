import React, { useContext } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { getLogoChainByChainId } from 'src/utils/utils-network';
import { ChevronRightIcon, InfoOutlineIcon, ViewIcon } from '@chakra-ui/icons';
import { EditorContext, EditorContextType } from './EditorContext';

type Props = {
  tableName: string;
  onClick?: () => void;
  className?: string;
  chainName: string;
};

const SidebarEditorRow = ({
  chainName,
  tableName,
  className,
  onClick,
}: Props) => {
  const { editor } = useContext(EditorContext) as EditorContextType;
  const getChainIcon = () => {
    let iconClassName: string;
    switch (chainName) {
      case 'ethereum': {
        iconClassName = getLogoChainByChainId('ETH') || '';
        break;
      }
      case 'arbitrum': {
        iconClassName = getLogoChainByChainId('BSC') || '';
        break;
      }
      default:
        iconClassName = getLogoChainByChainId('POLYGON') || '';
        break;
    }
    return <Box className={iconClassName}></Box>;
  };

  const addTableNameToEditor = () => {
    const position = editor.current.editor.getCursorPosition();
    editor.current.editor.session.insert(position, tableName);
  };

  return (
    <Box cursor={'pointer'} width={'100%'} className={className}>
      <Flex alignItems="center">
        <Flex
          alignItems={'center'}
          justifyContent={'space-between'}
          flex={1}
          onClick={onClick}
          className={'table-name'}
        >
          <Flex alignItems={'center'}>
            <InfoOutlineIcon />
            <Text
              marginLeft={3}
              fontSize={'13px'}
              fontWeight={'600'}
              color={'blue.100'}
            >
              {chainName}
            </Text>
            <Text marginLeft={3} fontSize={'13px'}>
              {tableName}
            </Text>
          </Flex>
          {getChainIcon()}
        </Flex>
        <Flex alignItems={'center'}>
          <ViewIcon marginLeft={3} />
          <ChevronRightIcon marginLeft={3} onClick={addTableNameToEditor} />
        </Flex>
      </Flex>
    </Box>
  );
};

export default SidebarEditorRow;
