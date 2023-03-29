import { useParams } from 'react-router-dom';

interface ParamTypes {
  authorId: string;
  dashboardId: string;
}

const DashboardDetailPage: React.FC = () => {
  const { authorId, dashboardId } = useParams<ParamTypes>();

  return (
    <div>Dashboard Detail Page {authorId} {dashboardId}</div>
  );
};

export default DashboardDetailPage;