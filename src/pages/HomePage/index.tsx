import React, {useCallback, useEffect, useState} from 'react';
import 'src/styles/pages/HomePage.scss';
import {Flex, Box} from '@chakra-ui/react';
import ListApps from './parts/ListApps';
import PartUserGraph from './parts/PartUserGraph';
import {BasePageContainer} from 'src/layouts';
import PartUserStats from './parts/PartUserStats';
import {AppButton, AppCard, RequestParams} from 'src/components';
import ModalCreateApp from 'src/modals/ModalCreateApp';
import rf from 'src/requests/RequestFactory';
import { functions } from 'lodash';

type AppStatsType = {
  totalApp: number;
  totalAppActive: number;
  totalAppInActive: number;
  totalRegistration: number;
  totalRegistrationActive: number;
}

const HomePage = () => {
  const [openModalCreateApp, setOpenModalCreateApp] = useState<boolean>(false);
  const [searchListApp, setSearchListApp] = useState<RequestParams>({});
  const [appStat, setAppStat] = useState<AppStatsType>({} as AppStatsType);
  
  const getAppStatOfUser = useCallback(async () => {
	try {
	  const res = await rf.getRequest('AppRequest').getAppStatsOfUser();
	  setAppStat(res);
	} catch (error: any) {
	  setAppStat({} as AppStatsType);
	}
  }, []);
  
  const onCreateAppSuccess = async () => {
	await getAppStatOfUser();
	setSearchListApp(prevState => prevState)
  }
  
  
  useEffect(() => {
	(async () => await getAppStatOfUser())()
  }, [getAppStatOfUser]);
  
  useEffect(() => {
	if (appStat.totalApp !== 0) return;
	setOpenModalCreateApp(true);
  }, [appStat.totalApp]);

  
  
  const _renderNoApp = () => {
	return (
	  <AppCard className={'no-app'}>
		<Flex my={14} flexDirection={'column'} alignItems={'center'}>
		  <Box className={'no-app__title'}>You don’t have any Apps</Box><Box className={'no-app__description'}>
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
	);
  };
  
  return (
	<BasePageContainer>
	  <>
		{appStat.totalApp > 0 ? (
		  <>
			<PartUserStats
			  totalWebhookActive={appStat?.totalRegistrationActive}
			/>
			<ListApps
			  totalAppActive={appStat?.totalAppActive}
			  totalApps={appStat.totalApp}
			  setOpenModalCreateApp={() => setOpenModalCreateApp(true)}
			  searchListApp={searchListApp}
			/>
			<PartUserGraph/>
		  </>
		) : (
		  _renderNoApp()
		)}
		<ModalCreateApp
		  open={openModalCreateApp}
		  onClose={() => setOpenModalCreateApp(false)}
		  reloadData={onCreateAppSuccess}
		/>
	  </>
	</BasePageContainer>
  );
};

export default HomePage;
