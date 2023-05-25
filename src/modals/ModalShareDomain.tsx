import { Box, Flex, Text } from '@chakra-ui/react';
import { AppInput } from 'src/components';
import { copyToClipboard } from 'src/utils/utils-helper';
import BaseModal from './BaseModal';

export interface IModalSetting {
  open: boolean;
  onClose: () => void;
  link?: string;
}

const ModalShareDomain = ({ open, onClose, link }: IModalSetting) => {
  const linkDefault = window.location.toString();
  const handleCopyLink = () => {
    link ? copyToClipboard(link) : copyToClipboard(linkDefault);
  };
  return (
    <BaseModal
      size="xl"
      isOpen={open}
      onClose={onClose}
      className="modal-share-domain"
    >
      <Flex direction={'column'}>
        <div className="modal-share-domain__title">Share</div>
        <Flex className="modal-share-domain__desc">
          <div className="bg-facebook_icon social-media" />
          <div className="bg-twitter_icon social-media" />
          <div className="bg-telegram_icon social-media" />
          <div className="bg-twitter_icon social-media" />
        </Flex>
        <div>
          <Text className="input-label">Click to Copy Link </Text>
          <AppInput
            readOnly
            value={link ? link : linkDefault}
            pr="48px"
            endAdornment={
              <Box
                className="bg-copy_icon"
                onClick={handleCopyLink}
                cursor="pointer"
              />
            }
          />
        </div>
      </Flex>
    </BaseModal>
  );
};

export default ModalShareDomain;
