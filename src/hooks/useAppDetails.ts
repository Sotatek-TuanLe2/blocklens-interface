import { useState, useEffect, useCallback } from 'react';
import { IAppResponse } from 'src/utils/utils-app';
import rf from '../requests/RequestFactory';

const useAppDetails = (appId: string) => {
  const [appInfo, setAppInfo] = useState<IAppResponse | any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getAppInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = (await rf
        .getRequest('AppRequest')
        .getAppDetail(appId)) as any;
      setAppInfo(res);
      setIsLoading(false);
    } catch (error: any) {
      setAppInfo({});
      setIsLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    getAppInfo().then();
  }, [appId]);

  return {
    appInfo,
    getAppInfo,
    isLoading
  };
};

export default useAppDetails;
