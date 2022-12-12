import { Box, Flex } from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import 'src/styles/pages/AppDetail.scss';
import { BasePageContainer } from 'src/layouts';
import { AppButton, AppLink } from 'src/components';
import WebhookSettings from './parts/WebhookSettings';
import WebhookActivities from './parts/WebhookActivities';
import { IWebhook } from 'src/utils/utils-webhook';
import PartWebhookStats from './parts/PartWebhookStats';
import { isMobile } from 'react-device-detect';
import { formatShortText } from 'src/utils/utils-helper';
import PartWebhookGraph from './parts/PartWebhookGraph';

const WebhookDetail = () => {
  const [webhook, setWebhook] = useState<IWebhook | any>({});
  const [appInfo, setAppInfo] = useState<any>({});
  const [isShowSetting, setIsShowSetting] = useState<boolean>(false);
  const [isShowAllActivities, setIsShowAllActivities] =
    useState<boolean>(false);

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

  const _renderAllActivities = () => {
    return (
      <>
        <Flex className="app-info">
          <Flex className="name">
            <Box
              cursor={'pointer'}
              className="icon-arrow-left"
              mr={6}
              onClick={() => setIsShowAllActivities(false)}
            />
            <Box>All Activities</Box>
          </Flex>
        </Flex>
        <WebhookActivities
          appInfo={appInfo}
          registrationId={webhook.registrationId}
          webhook={webhook}
          isShowAll={isShowAllActivities}
        />
      </>
    );
  };

  const _renderWebhookDetail = () => {
    return (
      <>
        <Flex className="app-info">
          <Flex className="name">
            <AppLink to={`/apps/${appId}`}>
              <Box className="icon-arrow-left" mr={6} />
            </AppLink>
            <Box>
              {isMobile
                ? `wh: ${formatShortText(webhook.registrationId)}`
                : `Webhook: ${webhook.registrationId}`}
            </Box>
          </Flex>

          <Flex>
            <AppButton
              size={'md'}
              px={isMobile ? 2.5 : 4}
              variant="cancel"
              onClick={() => setIsShowSetting(true)}
            >
              <Box className="icon-settings" mr={isMobile ? 0 : 2} />
              {isMobile ? '' : 'Setting'}
            </AppButton>
          </Flex>
        </Flex>
        <PartWebhookStats />
        <WebhookActivities
          appInfo={appInfo}
          registrationId={webhook.registrationId}
          webhook={webhook}
          onShowAll={() => setIsShowAllActivities(true)}
          isShowAll={isShowAllActivities}
        />
        <PartWebhookGraph />
      </>
    );
  };

  if(!Object.keys(webhook).length) {
    return (
      <BasePageContainer className="app-detail">
        <Flex justifyContent='center'>
         Webhook Not Found
        </Flex>
      </BasePageContainer>
    )
  }

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
          {isShowAllActivities
            ? _renderAllActivities()
            : _renderWebhookDetail()}
        </>
      )}
    </BasePageContainer>
  );
};

export default WebhookDetail;
