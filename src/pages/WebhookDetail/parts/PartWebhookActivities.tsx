import { Box, Flex, Text } from '@chakra-ui/react';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { AppCard } from 'src/components';
import 'src/styles/pages/NotificationPage.scss';
import 'src/styles/pages/AppDetail.scss';
import { ArrowRightIcon } from 'src/assets/icons';
import { IWebhook } from 'src/utils/utils-webhook';
import { useHistory, useParams } from 'react-router';
import { isMobile } from 'react-device-detect';
import 'src/styles/pages/HomePage.scss';
import ActivityDatatable from 'src/components/ActivityDatatable';
import { filterParams } from 'src/utils/utils-helper';
import rf from 'src/requests/RequestFactory';

interface IPartRecentActivities {
  webhook: IWebhook;
}

const PartWebhookActivities: FC<IPartRecentActivities> = ({ webhook }) => {
  const { id: webhookId } = useParams<{ id: string }>();
  const [activity, setActivity] = useState<any[]>([]);
  const history = useHistory();

  const fetchDataActivity: any = useCallback(async (params: any) => {
    try {
      const dataActivities = await rf
        .getRequest('NotificationRequest')
        .getActivities(webhookId, filterParams(params));
      setActivity(dataActivities.docs);
      return dataActivities;
    } catch (error) {
      console.error(error);
    }
  }, []);

  const _renderLinkShowAll = () => {
    return (
      <Flex alignItems={'center'} className="view-all">
        <Box
          cursor={'pointer'}
          _hover={{ textDecoration: 'underline' }}
          onClick={() => history.push(`/webhooks/${webhookId}/activities`)}
          mr={2}
        >
          View More Activity
        </Box>
        <ArrowRightIcon />
      </Flex>
    );
  };

  return (
    <AppCard className="list-table-wrap">
      <Flex className="title-list-app">
        <Text className="text-title">Recent Activities</Text>
        {!isMobile && !!activity.length && _renderLinkShowAll()}
      </Flex>

      <ActivityDatatable
        hidePagination
        limit={5}
        fetchDataTable={fetchDataActivity}
      />

      {isMobile && (
        <Flex justifyContent={'center'} my={4}>
          {!!activity.length && _renderLinkShowAll()}
        </Flex>
      )}
    </AppCard>
  );
};

export default PartWebhookActivities;
