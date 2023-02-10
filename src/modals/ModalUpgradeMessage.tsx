import { Box, Flex } from '@chakra-ui/react';
import { FC } from 'react';
import BaseModal from './BaseModal';
import { useHistory } from 'react-router';
import AppButton from 'src/components/AppButton';
import { isMobile } from 'react-device-detect';
import { MetadataPlan } from 'src/store/metadata';
import useUser from 'src/hooks/useUser';
import useMetadata from 'src/hooks/useMetadata';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ModalUpgradeMessage: FC<Props> = ({ open, onClose }) => {
  const history = useHistory();
  const { user } = useUser();
  const { billingPlans } = useMetadata();
  const indexMyPlan = billingPlans.findIndex(
    (item: MetadataPlan) => item.code === user?.getPlan().code,
  );
  const nextPlan = billingPlans[indexMyPlan + 1];

  return (
    <BaseModal
      size="xl"
      icon="icon-add-app"
      title="Want To Receive More Message?"
      isOpen={open}
      isFullScreen={isMobile}
      onClose={onClose}
    >
      <Box className={'modal__description'}>
        You have reached the limit of {user?.getPlan()?.notificationLimitation}{' '}
        messages/day in your current plan.Upgrade to <b>Growth</b> to enjoy{' '}
        {nextPlan?.appLimitation} messages/day
      </Box>
      <Flex flexWrap={'wrap'} justifyContent={'center'}>
        <AppButton size={'lg'} onClick={() => history.push('/billing')}>
          Upgrade Now
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalUpgradeMessage;
