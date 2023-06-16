import { useParams } from 'react-router-dom';
import { Flex } from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import ReactMarkdown from 'react-markdown';
import 'react-resizable/css/styles.css';
import ModalForkDashBoardDetails from 'src/modals/querySQL/ModalForkDashBoardDetails';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/TableValue.scss';
import 'src/styles/pages/DashboardDetailPage.scss';
import 'src/styles/components/Chart.scss';
import 'src/styles/components/AppQueryMenu.scss';
import { IDashboardDetail } from 'src/utils/query.type';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import Header from 'src/pages/WorkspacePage/parts/Header';
import VisualizationItem from 'src/pages/WorkspacePage/parts/VisualizationItem';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import { Dashboard } from 'src/utils/utils-dashboard';
import { LoadingFullPage } from 'src/pages/LoadingFullPage';

export interface ILayout extends Layout {
  options: any;
  i: string;
  id: string;
  dashboardVisuals: [];
  text: string;
  type: string;
  visualization: any;
  content: any;
}

export enum TYPE_MODAL {
  ADD = 'add',
  EDIT = 'edit',
}

export const WIDGET_TYPE = {
  VISUALIZATION: 'visualization',
  TEXT: 'text',
};

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardPart: React.FC = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();

  const [dataLayouts, setDataLayouts] = useState<ILayout[]>([]);
  const [dataDashboard, setDataDashboard] = useState<IDashboardDetail>();
  const [openModalFork, setOpenModalFork] = useState<boolean>(false);
  const [isEmptyDashboard, setIsEmptyDashboard] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLayoutData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await rf
        .getRequest('DashboardsRequest')
        .getPublicDashboardById(dashboardId);
      if (res) {
        const visualization: ILayout[] = res.dashboardVisuals.map(
          (item: ILayout) => {
            const { options } = item;
            return {
              x: options.sizeX || 0,
              y: options.sizeY || 0,
              w: options.col,
              h: options.row,
              i: item.id,
              id: item.id,
              type: WIDGET_TYPE.VISUALIZATION,
              content: item.visualization,
            };
          },
        );
        const textWidgets: ILayout[] = res.textWidgets.map((item: ILayout) => {
          const { options } = item;
          return {
            x: options.sizeX || 0,
            y: options.sizeY || 0,
            w: options.col,
            h: options.row,
            i: item.id,
            id: item.id,
            type: WIDGET_TYPE.TEXT,
            text: item.text,
            content: {},
          };
        });

        const layouts = visualization.concat(textWidgets);
        setDataDashboard(res);
        setDataLayouts(layouts);
        setIsEmptyDashboard(!layouts.length);
      }
    } catch (error) {
      toastError({
        message: getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  }, [dashboardId]);

  useEffect(() => {
    if (dashboardId) {
      fetchLayoutData();
    }
  }, [dashboardId]);

  const dashboardClass = useMemo(() => {
    if (!dataDashboard) {
      return null;
    }
    return new Dashboard(dataDashboard);
  }, [dataDashboard]);

  const _renderEmptyDashboard = () => (
    <Flex
      className="empty-dashboard"
      justifyContent={'center'}
      alignItems={'center'}
    >
      Dashboard is empty
    </Flex>
  );

  const _renderDashboard = () => {
    if (isEmptyDashboard) {
      return _renderEmptyDashboard();
    }
    return (
      <ResponsiveGridLayout
        className="main-grid-layout"
        layouts={{ lg: dataLayouts }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 12, xs: 6, xxs: 4 }}
        isDraggable={false}
        isResizable={false}
        measureBeforeMount
        containerPadding={[0, 30]}
        margin={[20, 20]}
      >
        {dataLayouts.map((item) => (
          <div className="box-layout" key={item.id}>
            <div className="box-chart">
              {item.type === WIDGET_TYPE.VISUALIZATION ? (
                <VisualizationItem
                  visualization={item.content}
                  needAuthentication={false}
                />
              ) : (
                <div className="box-text-widget">
                  <ReactMarkdown>{item.text}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    );
  };

  return (
    <div className="workspace-page__editor__dashboard">
      <Header
        type={LIST_ITEM_TYPE.DASHBOARDS}
        author={
          dashboardClass
            ? `${dashboardClass?.getUser().firstName} ${
                dashboardClass?.getUser().lastName
              }`
            : ''
        }
        data={dataDashboard}
        needAuthentication={false}
        isLoadingRun={isLoading}
      />

      {isLoading ? (
        <LoadingFullPage />
      ) : (
        <div className="dashboard-container">
          {_renderDashboard()}
          <ModalForkDashBoardDetails
            dashboardId={dashboardId}
            open={openModalFork}
            onClose={() => setOpenModalFork(false)}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardPart;
