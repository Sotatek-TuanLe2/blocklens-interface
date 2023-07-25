import { useState, useEffect, useCallback } from 'react';
import rf from 'src/requests/RequestFactory';
import { IWebhook } from 'src/utils/utils-webhook';

const useWebhookDetails = (webhookId: string) => {
  const [webhook, setWebhook] = useState<IWebhook | any>({});

  const getWebhookInfo = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('RegistrationRequest')
        .getRegistration(webhookId)) as any;
      setWebhook(res);
    } catch (error: any) {
      setWebhook({});
    }
  }, [webhookId]);

  useEffect(() => {
    getWebhookInfo().then();
  }, [webhookId]);

  return {
    webhook,
    getWebhookInfo,
  };
};

export default useWebhookDetails;
