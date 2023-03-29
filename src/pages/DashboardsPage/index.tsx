import 'src/styles/pages/DashboardsPage.scss';

const DashboardsPage: React.FC = () => {
  return (
    <div className="dashboards-page">
      <div className="dashboard-tabs"></div>
      <div className="dashboard-list"></div>
      <div className="dashboard-filter">
        <div className="dashboard-filter__search"></div>
        <div className="dashboard-filter__tags"></div>
      </div>
    </div>
  );
};

export default DashboardsPage;
