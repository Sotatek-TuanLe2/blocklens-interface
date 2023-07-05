import { Box, Flex, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import { AppCard } from 'src/components';
import 'src/styles/pages/NotificationPage.scss';
import 'src/styles/pages/AppDetail.scss';
import { ArrowRightIcon } from 'src/assets/icons';
import { IWebhook } from 'src/utils/utils-webhook';
import { useHistory, useParams } from 'react-router';
import { isMobile } from 'react-device-detect';
import 'src/styles/pages/HomePage.scss';
import ActivityDatatable from 'src/components/ActivityDatatable';

interface IPartRecentActivities {
  webhook: IWebhook;
}

const PartWebhookActivities: FC<IPartRecentActivities> = ({ webhook }) => {
  const { id: webhookId } = useParams<{ id: string }>();
  const history = useHistory();

  const _renderLinkShowAll = () => {
    return (
      <Flex alignItems={'center'} className="view-all">
        <Box
          cursor={'pointer'}
          _hover={{ textDecoration: 'underline' }}
          onClick={() =>
            history.push(
              `/app/${webhook?.appId}/webhooks/${webhookId}/activities`,
            )
          }
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
        {!isMobile && _renderLinkShowAll()}
      </Flex>

      <ActivityDatatable hidePagination limit={5} />

      {isMobile && (
        <Flex justifyContent={'center'} my={4}>
          {_renderLinkShowAll()}
        </Flex>
      )}
    </AppCard>
  );
};

export default PartWebhookActivities;
