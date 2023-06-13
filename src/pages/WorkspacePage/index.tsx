import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { BasePage } from 'src/layouts';
import { ROUTES } from 'src/utils/common';
import Dashboard from './parts/Dashboard';
import Query from './parts/Query';
import Sidebar from './parts/Sidebar';
import 'src/styles/pages/WorkspacePage.scss';

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
    // resize widgets in dashboard
    setTimeout(() => window.dispatchEvent(new Event('resize')), 500);
  };

  return (
    <BasePage isFullWidth>
      <div className="workspace-page">
        <Sidebar
          expandSidebar={toggleExpandSidebar}
          onToggleExpandSidebar={onToggleExpandSidebar}
        />
        <div
          className={`workspace-page__editor ${
            toggleExpandSidebar ? '' : 'workspace-page__editor--expand'
          }`}
        >
          {type === WORKSPACE_TYPES.DASHBOARD ? <Dashboard /> : <Query />}
        </div>
      </div>
    </BasePage>
  );
};

export default WorkspacePage;
