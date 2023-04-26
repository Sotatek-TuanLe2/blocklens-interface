import React, { useContext } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { getLogoChainByChainId } from 'src/utils/utils-network';
import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  EditorContext,
  EditorContextType,
} from '../../pages/QueriesPage/context/EditorContext';

type Props = {
  tableName: string;
  tableFullName: string;
  onClick?: () => void;
  className?: string;
  chainName: string;
};

const SidebarEditorRow = ({
  chainName,
  tableName,
  tableFullName,
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
    editor.current.editor.session.insert(position, tableFullName);
    editor.current.editor.focus();
  };

  return (
    <Box cursor={'pointer'} width={'100%'} className={className}>
      <Flex alignItems="center" className="row-name-wrap">
        <Flex
          alignItems={'center'}
          justifyContent={'space-between'}
          flex={1}
          onClick={onClick}
          className={'row-name'}
        >
          <Flex alignItems={'center'} className="row-name__row">
            <Text
              fontSize={'13px'}
              fontWeight={'600'}
              color={'blue.100'}
              marginLeft={3}
            >
              {chainName}
            </Text>
            <Text
              isTruncated
              fontSize={'13px'}
              marginLeft={3}
              title={tableName}
            >
              {tableName}
            </Text>
          </Flex>
          <div>{getChainIcon()}</div>
        </Flex>
        <Flex alignItems={'center'} className="row-icon">
          <ChevronRightIcon
            marginLeft={3}
            onClick={addTableNameToEditor}
            cursor="pointer"
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default SidebarEditorRow;
