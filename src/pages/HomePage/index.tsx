import React, { useEffect, useState } from 'react';
import 'src/styles/pages/HomePage.scss';
import { Flex, Box } from '@chakra-ui/react';
import ListApps from './parts/ListApps';
import PartUserGraph from './parts/PartUserGraph';
import { BasePageContainer } from 'src/layouts';
import PartUserStats from './parts/PartUserStats';
import { AppButton, AppCard } from 'src/components';
import ModalCreateApp from 'src/modals/ModalCreateApp';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getUserStats } from '../../store/stats';

const HomePage = () => {
  const { totalApp, totalRegistrationActive } = useSelector(
    (state: RootState) => state.stats,
  );
  const hasApp = totalApp > 0;

  const dispatch = useDispatch();

  const [openModalCreateApp, setOpenModalCreateApp] = useState<boolean>(false);

  const onCreateAppSuccess = async () => {
    dispatch(getUserStats());
  };

  useEffect(() => {
    dispatch(getUserStats());
  }, []);

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
      {hasApp ? (
        <>
          <PartUserStats totalWebhookActive={totalRegistrationActive} />
          <ListApps />
          <PartUserGraph />
        </>
      ) : (
        _renderNoApp()
      )}
    </BasePageContainer>
  );
};

export default HomePage;
