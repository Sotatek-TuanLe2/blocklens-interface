import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BasePage } from 'src/layouts';
import { ROUTES } from 'src/utils/common';
import Dashboard from './parts/Dashboard';
import Query from './parts/Query';
import Sidebar from './parts/Sidebar';
import 'src/styles/pages/WorkspacePage.scss';
import { Box } from '@chakra-ui/react';

export const WORKSPACE_TYPES = {
  DASHBOARD: 'dashboard',
  QUERY: 'query',
};

const WorkspacePage: React.FC = () => {
  const { pathname } = useLocation();

  const [toggleExpandSidebar, setToggleExpandSidebar] = useState<boolean>(true);

  const type = useMemo(() => {
    if (pathname.includes(ROUTES.MY_DASHBOARD)) {
      return WORKSPACE_TYPES.DASHBOARD;
    }
    return WORKSPACE_TYPES.QUERY;
  }, [pathname]);

  const onToggleExpandSidebar = (toggle?: boolean) => {
    setToggleExpandSidebar((prevState) => toggle || !prevState);
  };

  const isQuery = type === WORKSPACE_TYPES.QUERY;

  return (
    <BasePage isFullWidth={isQuery} noHeader={isQuery}>
      <>
        <div
          className={`${
            type === WORKSPACE_TYPES.QUERY ? 'workspace-page__query' : ''
          } workspace-page`}
        >
          <Box display={{ base: 'none', lg: 'block' }}>
            {type === WORKSPACE_TYPES.QUERY && (
              <Sidebar
                expandSidebar={toggleExpandSidebar}
                onToggleExpandSidebar={onToggleExpandSidebar}
              />
            )}
          </Box>
          <div
            className={`workspace-page__editor ${
              type === WORKSPACE_TYPES.QUERY
                ? 'workspace-page__editor--query'
                : ''
            } ${toggleExpandSidebar ? '' : 'workspace-page__editor--expand'}`}
          >
            {type === WORKSPACE_TYPES.DASHBOARD ? <Dashboard /> : <Query />}
          </div>
        </div>
      </>
    </BasePage>
  );
};

export default WorkspacePage;
