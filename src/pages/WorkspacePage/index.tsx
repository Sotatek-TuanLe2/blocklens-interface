import { useMemo } from 'react';
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

  const type = useMemo(() => {
    if (pathname.includes(ROUTES.DASHBOARD)) {
      return WORKSPACE_TYPES.DASHBOARD;
    }
    return WORKSPACE_TYPES.QUERY;
  }, [pathname]);

  return (
    <BasePage>
      <div className="workspace-page">
        <Sidebar />
        <div className="workspace-page__editor">
          {type === WORKSPACE_TYPES.DASHBOARD ? <Dashboard /> : <Query />}
        </div>
      </div>
    </BasePage>
  );
};

export default WorkspacePage;
