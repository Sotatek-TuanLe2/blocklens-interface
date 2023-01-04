import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import { useHistory, useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import { BasePageContainer } from 'src/layouts';
import { AppButton, AppHeading } from 'src/components';
import PartWebhookStats from './parts/PartWebhookStats';
import { isMobile } from 'react-device-detect';
import { formatShortText } from 'src/utils/utils-helper';
import PartWebhookGraph from './parts/PartWebhookGraph';
import PartRecentActivities from './parts/PartRecentActivities';
import useAppDetails from 'src/hooks/useAppDetails';
import useWebhookDetails from 'src/hooks/useWebhook';

const WebhookDetail = () => {
  const history = useHistory();
  const { appId, id: webhookId } = useParams<{ appId: string; id: string }>();

  const { appInfo } = useAppDetails(appId);
  const { webhook } = useWebhookDetails(appId, webhookId);

  if (!webhook && !Object.keys(webhook).length) {
    return (
      <BasePageContainer className="app-detail">
        <Flex justifyContent="center">Webhook Not Found</Flex>
      </BasePageContainer>
    );
  }

  const _renderHeading = () => {
    return (
      <Flex className="app-info">
        <AppHeading
          title={
            isMobile
              ? `wh: ${formatShortText(webhook?.registrationId)}`
              : `Webhook: ${webhook?.registrationId}`
          }
          linkBack={`/apps/${appId}`}
        />
        <Flex>
          <AppButton
            size={'md'}
            px={isMobile ? 2.5 : 4}
            variant="cancel"
            onClick={() => history.push(`/app/${appId}/webhooks/${webhookId}/settings`)}
          >
            <Box className="icon-settings" mr={isMobile ? 0 : 2} />
            {isMobile ? '' : 'Setting'}
          </AppButton>
        </Flex>
      </Flex>
    );
  };

  return (
    <BasePageContainer className="app-detail">
      <>
        {_renderHeading()}

        <PartWebhookStats />

        <PartRecentActivities
          appInfo={appInfo}
          webhook={webhook}
        />

        <PartWebhookGraph />
      </>
    </BasePageContainer>
  );
};

export default WebhookDetail;
