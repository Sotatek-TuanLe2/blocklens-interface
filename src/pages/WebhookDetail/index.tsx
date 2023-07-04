import { Box, Flex } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import { BasePage } from 'src/layouts';
import { AppButton, AppHeading } from 'src/components';
import PartWebhookStats from './parts/PartWebhookStats';
import { isMobile } from 'react-device-detect';
import { formatShortText } from 'src/utils/utils-helper';
import PartWebhookGraph from './parts/PartWebhookGraph';
import PartWebhookActivities from './parts/PartWebhookActivities';
import { getLogoChainByChainId } from 'src/utils/utils-network';
import { IWebhook, WEBHOOK_STATUS } from 'src/utils/utils-webhook';
import rf from 'src/requests/RequestFactory';

const WebhookDetail = () => {
  const history = useHistory();
  const { appId, id: webhookId } = useParams<{ appId: string; id: string }>();
  const [webhook, setWebhook] = useState<IWebhook | any>({});

  const getWebhookInfo = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('RegistrationRequest')
        .getRegistration(appId, webhookId)) as any;
      setWebhook(res);
    } catch (error: any) {
      setWebhook({});
    }
  }, [appId, webhookId]);

  const _renderNoWebhook = () => {
    return <Flex justifyContent="center">Webhook Not Found</Flex>;
  };

  const _renderWebhookDetail = () => {
    return (
      <>
        <Flex className="app-info">
          <AppHeading
            title={
              isMobile
                ? `wh: ${formatShortText(webhook?.registrationId)}`
                : `Webhook: ${webhook?.registrationId}`
            }
            linkBack={`/app/${appId}`}
          />
          <Flex>
            {!isMobile && (
              <Flex alignItems={'center'} className="box-network">
                <Box className={getLogoChainByChainId(webhook?.chain)} mr={2} />
                <Box textTransform="capitalize">
                  {webhook?.network?.toLowerCase()}
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
              {!isMobile && (
                <Box className="setting-btn" ml={2}>
                  Setting
                </Box>
              )}
            </AppButton>
          </Flex>
        </Flex>

        <Box className={'statics'}>
          <PartWebhookStats
            totalWebhookActive={
              webhook.status === WEBHOOK_STATUS.DISABLED ? 0 : 1
            }
          />
        </Box>

        <PartWebhookActivities webhook={webhook} />

        <Box className={'user-graph'}>
          <PartWebhookGraph />
        </Box>
      </>
    );
  };

  return (
    <BasePage className="app-detail" onInitPage={getWebhookInfo}>
      {!webhook && !Object.keys(webhook).length
        ? _renderNoWebhook()
        : _renderWebhookDetail()}
    </BasePage>
  );
};

export default WebhookDetail;
