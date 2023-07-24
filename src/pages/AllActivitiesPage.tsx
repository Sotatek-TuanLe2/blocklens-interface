import { Box, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import { BasePage } from 'src/layouts';
import { optionsFilter } from 'src/utils/utils-webhook';
import { AppCard, AppHeading, AppInput } from 'src/components';
import { isMobile } from 'react-device-detect';
import ModalFilterActivities from '../modals/ModalFilterActivities';
import { getLogoChainByChainId } from 'src/utils/utils-network';
import useWebhookDetails from 'src/hooks/useWebhook';
import ActivityDatatable from 'src/components/ActivityDatatable';

const AllActivitiesPage = () => {
  const initParams = {
    search: '',
    method: '',
    status: '',
    txHash: '',
    tokenId: '',
    address: '',
  };
  const { id: webhookId } = useParams<{ appId: string; id: string }>();
  const [params, setParams] = useState<any>(initParams);
  const { webhook } = useWebhookDetails(webhookId);
  const [isOpenFilterModal, setIsOpenFilterModal] = useState<boolean>(false);

  const _renderBoxFilter = () => {
    if (!isMobile) return <Box p={5} />;
    return (
      <Flex className="box-filter activities-all" flex={'1 1 0'}>
        <Box width={'85%'}>
          <AppInput
            isSearch
            className={'input-search'}
            type="text"
            placeholder={'Search...'}
            value={params.search}
            onChange={(e) =>
              setParams({
                ...params,
                search: e.target.value.trim(),
              })
            }
          />
        </Box>
        <Box
          className="icon-filter-mobile"
          onClick={() => setIsOpenFilterModal(true)}
        />
      </Flex>
    );
  };

  return (
    <BasePage className="app-detail">
      <>
        <Flex className="app-info">
          <AppHeading
            isCenter
            title="All Activities"
            linkBack={`/webhooks/${webhookId}`}
          />

          {!isMobile && (
            <Flex alignItems={'center'} className="box-network">
              <Box className={getLogoChainByChainId(webhook?.chain)} mr={2} />
              <Box textTransform="capitalize">
                {webhook?.network?.toLowerCase()}
              </Box>
            </Flex>
          )}
        </Flex>

        <AppCard className="list-table-wrap">
          {_renderBoxFilter()}

          <ActivityDatatable
            params={params}
            setParams={setParams}
            isFilter
            limit={15}
          />

          {isOpenFilterModal && (
            <ModalFilterActivities
              open={isOpenFilterModal}
              value={status}
              onClose={() => setIsOpenFilterModal(false)}
              onChange={(status) => {
                setParams({
                  ...params,
                  status,
                });
              }}
              options={optionsFilter}
            />
          )}
        </AppCard>
      </>
    </BasePage>
  );
};

export default AllActivitiesPage;
