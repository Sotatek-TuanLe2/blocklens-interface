import { Box, Flex, Text } from '@chakra-ui/react';
import { AppInput } from 'src/components';
import { copyToClipboard } from 'src/utils/utils-helper';
import BaseModal from '../BaseModal';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
} from 'react-share';

export interface IModalSetting {
  open: boolean;
  onClose: () => void;
  link?: string;
}

const ModalShareDomain = ({ open, onClose, link }: IModalSetting) => {
  const linkDefault = window.location.toString();
  const handleCopyLink = () => {
    copyToClipboard(link || linkDefault);
  };
  const getLinkShare = () => {
    if (process.env.REACT_APP_ENV === 'prod') return linkDefault;
    else return 'https://blocklens.io/';
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
          <FacebookShareButton url={getLinkShare()}>
            <div className="bg-facebook_icon social-media" />
          </FacebookShareButton>
          <TwitterShareButton url={getLinkShare()}>
            <div className="bg-twitter_icon social-media" />
          </TwitterShareButton>
          <TelegramShareButton url={getLinkShare()}>
            <div className="bg-telegram_icon social-media" />
          </TelegramShareButton>
          <LinkedinShareButton url={getLinkShare()}>
            <div className="bg-linkedin_icon social-media" />
          </LinkedinShareButton>
        </Flex>
        <div>
          <Text className="input-label">Click to Copy Link </Text>
          <AppInput
            readOnly
            value={link || linkDefault}
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
