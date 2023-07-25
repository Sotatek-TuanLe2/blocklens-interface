import { useState, useEffect, useCallback } from 'react';
import { IAppResponse } from 'src/utils/utils-app';
import rf from '../requests/RequestFactory';

const useAppDetails = (projectId: string) => {
  const [appInfo, setAppInfo] = useState<IAppResponse | any>({});

  const getAppInfo = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('AppRequest')
        .getAppDetail(projectId)) as any;
      setAppInfo(res);
    } catch (error: any) {
      setAppInfo({});
    }
  }, [projectId]);

  useEffect(() => {
    getAppInfo().then();
  }, [projectId]);

  return {
    appInfo,
    getAppInfo,
  };
};

export default useAppDetails;
