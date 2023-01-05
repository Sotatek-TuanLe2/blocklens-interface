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
import PartWebhookActivities from './parts/PartWebhookActivities';
import useAppDetails from 'src/hooks/useAppDetails';
import useWebhookDetails from 'src/hooks/useWebhook';
import { getLogoChainByChainId } from '../../utils/utils-network';

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

  return (
    <BasePageContainer className="app-detail">
      <>
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
            {!isMobile && (
              <Flex alignItems={'center'} className="box-network">
                <Box className={getLogoChainByChainId(appInfo.chain)} mr={2} />
                <Box textTransform="capitalize">
                  {appInfo?.network?.toLowerCase()}
                </Box>
              </Flex>
            )}

            <AppButton
              size={'md'}
              variant="cancel"
              onClick={() =>
                history.push(`/app/${appId}/webhooks/${webhookId}/settings`)
              }
            >
              <Box className="icon-settings" />
              {!isMobile && <Box ml={2}>Setting</Box>}
            </AppButton>
          </Flex>
        </Flex>

        <Box className={'statics'}>
          <PartWebhookStats />
        </Box>

        <PartWebhookActivities appInfo={appInfo} webhook={webhook} />

        <Box className={'user-graph'}>
          <PartWebhookGraph />
        </Box>
      </>
    </BasePageContainer>
  );
};

export default WebhookDetail;
