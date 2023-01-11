import { Box, Flex } from '@chakra-ui/react';
import { FC } from 'react';
import BaseModal from './BaseModal';
import { useHistory } from 'react-router';
import AppButton from 'src/components/AppButton';
import { isMobile } from 'react-device-detect';
import { MetadataPlan } from 'src/store/metadata';
import useUser from 'src/hooks/useUser';
import useMetadata from 'src/hooks/useMetadata';

interface ModalUpgradeCreateApp {
  open: boolean;
  onClose: () => void;
}

const ModalUpgradeCreateApp: FC<ModalUpgradeCreateApp> = ({
  open,
  onClose,
}) => {
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
      title="Want To Create More Apps?"
      isOpen={open}
      isFullScreen={isMobile}
      onClose={onClose}
    >
      <Box className={'modal__description'}>
        You can only create {user?.getPlan().appLimitation} active apps in your
        current plan, upgrade to{' '}
        <Box as={'span'} textTransform="lowercase">
          {nextPlan?.name}
        </Box>{' '}
        to enjoy {nextPlan?.appLimitation} active apps in maximum.
      </Box>
      <Flex flexWrap={'wrap'} justifyContent={'center'}>
        <AppButton size={'lg'} onClick={() => history.push('/billing')}>
          Upgrade Now
        </AppButton>
      </Flex>
    </BaseModal>
  );
};

export default ModalUpgradeCreateApp;
