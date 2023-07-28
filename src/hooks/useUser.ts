import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { User, UserInterface } from 'src/utils/utils-user';

type ReturnType = {
  user: UserInterface | null;
};

const useUser = (): ReturnType => {
  const { user: userStore } = useSelector((state: RootState) => state);

  const user = useMemo(() => {
    if (!userStore.info.email || !userStore.userId) {
      return null;
    }
    const newUser = new User(userStore);
    return newUser;
  }, [userStore]);

  return { user };
};

export default useUser;
