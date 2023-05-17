import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { BasePage } from 'src/layouts';
import { ROUTES } from 'src/utils/common';
import Dashboard from './parts/Dashboard';
import Header from './parts/Header';
import Query from './parts/Query';
import Sidebar from './parts/Sidebar';
import 'src/styles/pages/WorkspacePage.scss';

const WorkspacePage: React.FC = () => {
  const { pathname } = useLocation();

  const TYPES = {
    DASHBOARD: 'dashboard',
    QUERY: 'query',
  };

  const type = useMemo(() => {
    if (pathname.includes(ROUTES.DASHBOARD)) {
      return TYPES.DASHBOARD;
    }
    return TYPES.QUERY;
  }, [pathname]);

  return (
    <BasePage>
      <div className="workspace-page">
        <Header />
        <div className="workspace-page__body">
          <Sidebar />
          <div className="workspace-page__body__editor">
            <div className="workspace-page__body__editor__title"></div>
            {type === TYPES.DASHBOARD ? <Dashboard /> : <Query />}
          </div>
        </div>
      </div>
    </BasePage>
  );
};

export default WorkspacePage;
