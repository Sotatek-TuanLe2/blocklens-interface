import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { User, UserInterface } from 'src/utils/utils-user';

type ReturnType = {
  user: UserInterface | null;
};

const useUser = (): ReturnType => {
  const { userId, auth, info, stats, billing, settings } = useSelector((state: RootState) => state.user);

  const user = useMemo(() => {
    if (!userId) {
      return null;
    }
    const newUser = new User(userId);
    newUser.setAuth(auth);
    newUser.setInfo(info);
    newUser.setStats(stats);
    newUser.setBilling(billing);
    newUser.setSettings(settings);
    return newUser;
  }, [
    userId,
    auth,
    info,
    stats,
    billing,
    settings
  ]);

  return { user };
};

export default useUser;
