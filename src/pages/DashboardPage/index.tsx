import { useParams } from 'react-router-dom';

interface ParamTypes {
  authorId: string;
  dashboardId: string;
}

const DashboardPage: React.FC = () => {
  const { authorId, dashboardId } = useParams<ParamTypes>();

  return (
    <div>Dashboard Page {authorId} {dashboardId}</div>
  );
};

export default DashboardPage;