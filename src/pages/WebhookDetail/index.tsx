import { Box, Flex } from '@chakra-ui/react';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import { BasePageContainer } from 'src/layouts';
import { AppButton, AppGraph, AppLink } from 'src/components';
import WebhookSettings from './parts/WebhookSettings';
import WebhookActivities from './parts/WebhookActivities';
import { IWebhook } from 'src/utils/utils-webhook';
import PartWebhookStats from './parts/PartWebhookStats';

const WebhookDetail = () => {
  const [webhook, setWebhook] = useState<IWebhook | any>({});
  const [isShowSetting, setIsShowSetting] = useState<boolean>(false);

  const { appId, id: webhookId } = useParams<{ appId: string; id: string }>();

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
  }, []);

  return (
    <BasePageContainer className="app-detail">
      {isShowSetting ? (
        <WebhookSettings
          onBack={() => setIsShowSetting(false)}
          webhook={webhook}
          reloadData={getWebhookInfo}
        />
      ) : (
        <>
          <Flex className="app-info">
            <Flex className="name">
              <AppLink to={`/app-detail/${appId}`}>
                <Box className="icon-arrow-left" mr={6} />
              </AppLink>
              <Box>Webhook: {webhook.registrationId}</Box>
            </Flex>

            <Flex>
              <AppButton
                size={'md'}
                variant="cancel"
                mr={5}
                onClick={() => setIsShowSetting(true)}
              >
                <Box className="icon-settings" mr={2} /> Setting
              </AppButton>
            </Flex>
          </Flex>

          <PartWebhookStats />

          <WebhookActivities registrationId={webhook.registrationId} />
          <AppGraph type="webhook" />
        </>
      )}
    </BasePageContainer>
  );
};

export default WebhookDetail;
