import React, { useState } from 'react';
import 'src/styles/pages/HomePage.scss';
import { Flex, Box, Spinner } from '@chakra-ui/react';
import ListApps from './parts/ListApps';
import ListWebhooks from './parts/ListWebhooks';
import PartUserGraph from './parts/PartUserGraph';
import { BasePage } from 'src/layouts';
import PartUserStats from './parts/PartUserStats';
import { AppButton, AppCard, AppHeading } from 'src/components';
import ModalCreateApp from 'src/modals/ModalCreateApp';
import { getUserStats } from 'src/store/user';
import { useDispatch, useSelector } from 'react-redux';
import useUser from 'src/hooks/useUser';
import { NoAppIcon } from 'src/assets/icons';
import { useHistory } from 'react-router';
import { ROUTES } from 'src/utils/common';
import { RootState } from 'src/store';

const HomePage = () => {
  const { user } = useUser();
  const userStats = user?.getStats();
  const { isLoadingGetStatisticsUser } = useSelector(
    (state: RootState) => state.user,
  );
  const noData =
    !userStats?.totalProject && !userStats?.totalRegistrationWithoutAppId;

  const [openModalCreateApp, setOpenModalCreateApp] = useState<boolean>(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const onCreateAppSuccess = async () => {
    dispatch(getUserStats());
  };

  const _renderNoData = () => {
    return (
      <>
        <AppCard className={'no-app'}>
          <Flex my={14} flexDirection={'column'} alignItems={'center'}>
            <NoAppIcon />
            <Box className={'no-app__title'} mt={10}>
              You Don’t Have Any Project
            </Box>
            <Box className={'no-app__description'}>
              Create a new Project to start using Blocklens API
            </Box>
            <Flex>
              <AppButton
                className={'no-app__btn'}
                size={'lg'}
                onClick={() => history.push(ROUTES.CREATE_WEBHOOK)}
                variant={'outline'}
                mr={2}
              >
                Create New Webhook
              </AppButton>
              <AppButton
                className={'no-app__btn'}
                size={'lg'}
                onClick={() => setOpenModalCreateApp(true)}
              >
                Create New Project
              </AppButton>
            </Flex>
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

  const _renderContent = () => {
    return (
      <>
        <Box mb={7}>
          <AppHeading title="Triggers" />
        </Box>
        <Box className={'statics'}>
          <PartUserStats
            totalWebhookActive={userStats?.totalRegistrationActive}
            totalWebhook={userStats?.totalRegistration}
          />
        </Box>
        <Box>
          <ListApps />
        </Box>
        <Box className={'webhook'}>
          <ListWebhooks />
        </Box>
        <Box className={'user-graph'}>
          <PartUserGraph />
        </Box>
      </>
    );
  };

  const _renderTriggerPage = () => {
    if (isLoadingGetStatisticsUser) {
      return (
        <BasePage>
          <Flex justifyContent={'center'}>
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Flex>
        </BasePage>
      );
    }

    if (noData) return _renderNoData();
    return _renderContent();
  };

  return (
    <BasePage>
      <>{_renderTriggerPage()}</>
    </BasePage>
  );
};

export default HomePage;
