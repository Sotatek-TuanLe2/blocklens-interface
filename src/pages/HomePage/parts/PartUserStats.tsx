import React, { useCallback, useEffect, useState } from 'react';
import rf from 'src/requests/RequestFactory';
import AppStatics from 'src/components/AppStats';

interface IUserStats {
  totalThisMonth?: number;
  totalToday?: number;
  totalSuccessToday?: number;
}

const PartUserStats = () => {
  const [userStats, setUserStats] = useState<IUserStats>({});

  const getUserStats = useCallback(async () => {
    try {
      const res = (await rf
        .getRequest('NotificationRequest')
        .getUserStats()) as any;
      setUserStats(res);
    } catch (error: any) {
      setUserStats({});
    }
  }, []);

  useEffect(() => {
    getUserStats().then();
  }, []);

  return <AppStatics type="USER" stats={userStats} />;
};

export default PartUserStats;
