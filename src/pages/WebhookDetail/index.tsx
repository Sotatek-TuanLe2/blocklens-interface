import { Box, Flex } from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import rf from 'src/requests/RequestFactory';
import { useHistory, useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import { BasePageContainer } from 'src/layouts';
import { AppButton, AppHeading } from 'src/components';
import { IWebhook } from 'src/utils/utils-webhook';
import PartWebhookStats from './parts/PartWebhookStats';
import { isMobile } from 'react-device-detect';
import { formatShortText } from 'src/utils/utils-helper';
import PartWebhookGraph from './parts/PartWebhookGraph';
import PartRecentActivities from './parts/PartRecentActivities';

const WebhookDetail = () => {
  const [webhook, setWebhook] = useState<IWebhook | any>({});
  const [appInfo, setAppInfo] = useState<any>({});

  const history = useHistory();
  const { appId, id: webhookId } = useParams<{ appId: string; id: string }>();

  const getAppInfo = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('AppRequest')
        .getAppDetail(appId)) as any;
      setAppInfo(res);
    } catch (error: any) {
      setAppInfo({});
    }
  }, [appId]);

  const getWebhookInfo = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('RegistrationRequest')
        .getRegistration(appId, webhookId)) as any;
      setWebhook(res);
    } catch (error: any) {
      setWebhook({});
    }
  }, [webhookId]);

  useEffect(() => {
    getWebhookInfo().then();
    getAppInfo().then();
  }, []);

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
