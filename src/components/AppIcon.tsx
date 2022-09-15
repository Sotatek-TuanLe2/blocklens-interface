import { Box } from '@chakra-ui/react';
import React from 'react';

export const LIST_ICONS = {
  COPY: 'copy',
  DETAIL_INFO: 'detail_info',
  DONE: 'done',
  EDIT: 'edit',
  SEE_MORE: 'see_more',
  GOOGLE: 'google',
  ADDRESS_LABEL: 'address_label',
  COPY_BLUE: 'copy_blue',
  DOWN_ARROW: 'down_arrow',
  ETHEREUM_BLACK: 'ethereum_black',
  ETHEREUM_BLUE: 'ethereum_blue',
  LOCK: 'lock',
  NFT_LABEL: 'NFT_label',
  SHIELD: 'shield',
  SOLANA_BLACK: 'solana_black',
  SOLANA_BLUE: 'solana_blue',
};

interface IAppIcon {
  icon: string;
  classCustom?: string;
}

const AppIcon: React.FC<IAppIcon> = ({ icon, classCustom }) => {
  return <Box className={`bg-${icon} ${classCustom || ''}`} />;
};

export default AppIcon;
