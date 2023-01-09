import { useState } from 'react';
import 'src/styles/pages/HomePage.scss';
import { Flex, Box } from '@chakra-ui/react';
import ListApps from './parts/ListApps';
import PartUserGraph from './parts/PartUserGraph';
import { GuestPage } from 'src/layouts';
import PartUserStats from './parts/PartUserStats';
import { AppButton, AppCard, AppHeading } from 'src/components';
import ModalCreateApp from 'src/modals/ModalCreateApp';
import { getUserStats } from 'src/store/user';
import { useDispatch } from 'react-redux';
import useUser from 'src/hooks/useUser';

const HomePage = () => {
  const { user } = useUser();
  const userStats = user?.getStats();
  const hasApp = !!userStats?.totalApp && userStats?.totalApp > 0;

  const [openModalCreateApp, setOpenModalCreateApp] = useState<boolean>(false);

  const dispatch = useDispatch();

  const onCreateAppSuccess = async () => {
    dispatch(getUserStats());
  };

  const _renderNoApp = () => {
    return (
      <>
        <AppCard className={'no-app'}>
          <Flex my={14} flexDirection={'column'} alignItems={'center'}>
            <Box className={'no-app__title'}>You don’t have any Apps</Box>
            <Box className={'no-app__description'}>
              Create a new App to start using Blocksniper API
            </Box>
            <AppButton
              className={'no-app__btn'}
              size={'md'}
              onClick={() => setOpenModalCreateApp(true)}
            >
              Create New App
            </AppButton>
          </Flex>
        </AppCard>
        <ModalCreateApp
          open={openModalCreateApp}
          onClose={() => setOpenModalCreateApp(false)}
          reloadData={onCreateAppSuccess}
        />
      </>
    );
  };

  return (
    <GuestPage>
      <>
        <Box mb={7}>
          <AppHeading title="Dashboard" />
        </Box>

        {hasApp ? (
          <>
            <Box className={'statics'}>
              <PartUserStats
                totalWebhookActive={userStats?.totalRegistrationActive}
                totalWebhook={userStats?.totalRegistration}
              />
            </Box>

            <ListApps />

            <Box className={'user-graph'}>
              <PartUserGraph />
            </Box>
          </>
        ) : (
          _renderNoApp()
        )}
      </>
    </GuestPage>
  );
};

export default HomePage;
