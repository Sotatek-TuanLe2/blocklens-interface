import { Box, Flex } from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import rf from 'src/requests/RequestFactory';
import { useHistory, useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import { BasePageContainer } from 'src/layouts';
import WebhookActivities from 'src/pages/WebhookDetail/parts/WebhookActivities';
import { IWebhook } from 'src/utils/utils-webhook';

const WebhookActivitiesPage = () => {
  const [webhook, setWebhook] = useState<IWebhook | any>({});
  const [appInfo, setAppInfo] = useState<any>({});
  const { appId, id: webhookId } = useParams<{ appId: string; id: string }>();
  const history = useHistory();

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

  return (
    <BasePageContainer className="app-detail">
      <>
        <Flex className="app-info">
          <Flex className="name">
            <Box
              cursor={'pointer'}
              className="icon-arrow-left"
              mr={6}
              onClick={() =>
                history.push(`/app/${appId}/webhooks/${webhookId}`)
              }
            />
            <Box>All Activities</Box>
          </Flex>
        </Flex>
        <WebhookActivities
          appInfo={appInfo}
          registrationId={webhook.registrationId}
          webhook={webhook}
          isShowAll
        />
      </>
    </BasePageContainer>
  );
};

export default WebhookActivitiesPage;
