import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { BasePage } from 'src/layouts';
import { ROUTES } from 'src/utils/common';
import Dashboard from './parts/Dashboard';
import Query from './parts/Query';
import 'src/styles/pages/WorkspacePage.scss';
import { WORKSPACE_TYPES } from '../WorkspacePage';

const PublicWorkspacePage: React.FC = () => {
  const { pathname } = useLocation();

  const type = useMemo(() => {
    if (pathname.includes(ROUTES.DASHBOARD)) {
      return WORKSPACE_TYPES.DASHBOARD;
    }
    return WORKSPACE_TYPES.QUERY;
  }, [pathname]);

  const isQuery = type === WORKSPACE_TYPES.QUERY;

  return (
    <BasePage isFullWidth={isQuery} noHeader={isQuery}>
      <div
        className={`${
          type === WORKSPACE_TYPES.QUERY ? 'workspace-page__query' : ''
        } workspace-page`}
      >
        <div className="workspace-page__editor workspace-page__editor--full">
          {type === WORKSPACE_TYPES.DASHBOARD ? <Dashboard /> : <Query />}
        </div>
      </div>
    </BasePage>
  );
};

export default PublicWorkspacePage;
