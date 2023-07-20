import { useHistory, useLocation } from 'react-router-dom';
import { ROUTES } from 'src/utils/common';

type ReturnType = {
  originPath: string;
  goToOriginPath: () => void;
  goWithOriginPath: (url: string, originPathParam?: string) => void;
  generateLinkObject: (
    url: string,
    originPathParam?: string,
  ) => { pathname: string; state: { originPath: string } };
};

const useOriginPath = (): ReturnType => {
  const history = useHistory();
  const location = useLocation();

  const originPath: string = (location.state as any)?.originPath || ROUTES.HOME;

  const goToOriginPath = () => history.push(originPath);

  const goWithOriginPath = (url: string, originPathParam?: string) => {
    history.push({
      pathname: url,
      state: {
        originPath: originPathParam || originPath,
      },
    });
  };

  const generateLinkObject = (url: string, originPathParam?: string) => ({
    pathname: url,
    state: {
      originPath: originPathParam || originPath,
    },
  });

  return {
    originPath,
    goToOriginPath,
    goWithOriginPath,
    generateLinkObject,
  };
};

export default useOriginPath;
