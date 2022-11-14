import React, { useCallback, useEffect, useState } from 'react';
import rf from 'src/requests/RequestFactory';
import { useParams } from 'react-router';
import AppStatics from 'src/components/AppStats';

interface IAppStats {
  totalThisMonth?: number;
  totalToday?: number;
  totalSuccessToday?: number;
}

const PartAppStatics = () => {
  const { id: appId } = useParams<{ id: string }>();
  const [appStats, setAppStats] = useState<IAppStats>({});

  const getAppStats = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('NotificationRequest')
        .getAppStats(appId)) as any;
      setAppStats(res);
    } catch (error: any) {
      setAppStats({});
    }
  }, [appId]);

  useEffect(() => {
    getAppStats().then();
  }, []);

  return <AppStatics type="APP" stats={appStats} />;
};

export default PartAppStatics;
