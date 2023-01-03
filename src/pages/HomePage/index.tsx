import React, { useState } from 'react';
import 'src/styles/pages/HomePage.scss';
import { Flex, Box } from '@chakra-ui/react';
import ListApps from './parts/ListApps';
import PartUserGraph from './parts/PartUserGraph';
import { BasePageContainer } from 'src/layouts';
import PartUserStats from './parts/PartUserStats';
import { AppButton, AppCard } from 'src/components';
import ModalCreateApp from 'src/modals/ModalCreateApp';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { getUserStats } from 'src/store/user';
import { useDispatch } from 'react-redux';

const HomePage = () => {
  const {
    stats: { totalApp, totalRegistrationActive, totalRegistration },
  } = useSelector((state: RootState) => state.user);
  const hasApp = !!totalApp && totalApp > 0;

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
    <BasePageContainer>
      <>
        <Box className="title-heading">Dashboard</Box>
        {hasApp ? (
          <>
            <PartUserStats
              totalWebhookActive={totalRegistrationActive}
              totalWebhook={totalRegistration}
            />
            <ListApps />
            <PartUserGraph />
          </>
        ) : (
          _renderNoApp()
        )}
      </>
    </BasePageContainer>
  );
};

export default HomePage;
