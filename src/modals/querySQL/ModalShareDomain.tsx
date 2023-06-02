import { Box, Flex, Text } from '@chakra-ui/react';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from 'react-share';
import { AppInput } from 'src/components';
import { copyToClipboard } from 'src/utils/utils-helper';
import BaseModal from '../BaseModal';

export interface IModalSetting {
  open: boolean;
  onClose: () => void;
  link: string;
}

const ModalShareDomain = ({ open, onClose, link }: IModalSetting) => {
  const handleCopyLink = () => {
    copyToClipboard(link);
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
          <FacebookShareButton url={link}>
            <div className="bg-facebook_icon social-media" />
          </FacebookShareButton>
          <TwitterShareButton url={link}>
            <div className="bg-twitter_icon social-media" />
          </TwitterShareButton>
          <TelegramShareButton url={link}>
            <div className="bg-telegram_icon social-media" />
          </TelegramShareButton>
          <LinkedinShareButton url={link}>
            <div className="bg-linkedin_icon social-media" />
          </LinkedinShareButton>
        </Flex>
        <div>
          <Text className="input-label">Click to Copy Link </Text>
          <AppInput
            readOnly
            value={link}
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
