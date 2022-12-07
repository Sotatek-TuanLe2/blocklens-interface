import React, { useEffect, useState } from 'react';
import 'src/styles/pages/HomePage.scss';
import { Flex, Box } from '@chakra-ui/react';
import ListApps from './parts/ListApps';
import { BasePageContainer } from 'src/layouts';
import PartUserStats from './parts/PartUserStats';
import { AppButton, AppCard, AppGraph } from 'src/components';
import ModalCreateApp from 'src/modals/ModalCreateApp';
import rf from 'src/requests/RequestFactory';
import { toastError } from 'src/utils/utils-notify';

const HomePage = () => {
  const [totalApps, setTotalApps] = useState<any>({});
  const [open, setOpen] = useState<boolean>(false);
  const [searchListApp, setSearchListApp] = useState<any>({});

  const getTotalApp = async () => {
    try {
      const res = await rf.getRequest('AppRequest').getListApp();
      setTotalApps(res?.totalDocs);
      return res;
    } catch (error: any) {
      toastError({ message: error?.message || 'Oops. Something went wrong!' });
    }
  };

  useEffect(() => {
    getTotalApp().then();
  }, []);

  useEffect(() => {
    if (totalApps === 0) {
      setOpen(true);
    }
  }, [totalApps]);

  const _renderNoApp = () => {
    return (
      <AppCard className={'no-app'}>
        <Flex my={14} flexDirection={'column'} alignItems={'center'}>
          <Box className={'no-app__title'}>You don’t have any Apps</Box>
          <Box className={'no-app__description'}>
            Create a new App to start using BlockLens API
          </Box>
          <AppButton
            className={'no-app__btn'}
            size={'md'}
            onClick={() => setOpen(true)}
          >
            Create New App
          </AppButton>
        </Flex>
      </AppCard>
    );
  };

  return (
    <BasePageContainer>
      <>
        {totalApps > 0 ? (
          <>
            <PartUserStats />
            <ListApps
              totalApps={totalApps}
              setOpenModalCreateApp={() => setOpen(true)}
              searchListApp={searchListApp}
            />
            <AppGraph type="user" />
          </>
        ) : (
          _renderNoApp()
        )}

        {open && (
          <ModalCreateApp
            open={open}
            onClose={() => setOpen(false)}
            reloadData={() => {
              getTotalApp().then();
              setSearchListApp((pre: any) => {
                return { ...pre };
              });
            }}
          />
        )}
      </>
    </BasePageContainer>
  );
};

export default HomePage;
