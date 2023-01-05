import { useState, useEffect, useCallback } from 'react';
import { IAppResponse } from 'src/utils/utils-app';
import rf from '../requests/RequestFactory';

const useAppDetails = (appId: string) => {
  const [appInfo, setAppInfo] = useState<IAppResponse | any>({});

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

  useEffect(() => {
    getAppInfo().then();
  }, [appId]);

  return {
    appInfo,
    getAppInfo
  };
};

export default useAppDetails;
