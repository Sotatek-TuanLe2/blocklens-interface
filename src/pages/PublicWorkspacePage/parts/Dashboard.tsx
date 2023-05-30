import { useParams } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import ReactMarkdown from 'react-markdown';
import 'react-resizable/css/styles.css';
import { AppTag } from 'src/components';
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
import AppNetworkIcons from 'src/components/AppNetworkIcons';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';

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

  const layoutChangeTimeout = useRef() as any;

  const fetchLayoutData = useCallback(async () => {
    try {
      const res = await rf
        .getRequest('DashboardsRequest')
        .getPublicDashboardById(dashboardId);
      if (res) {
        const visualization: ILayout[] = res.dashboardVisuals.map(
          (item: ILayout) => {
            const { options } = item;
            return {
              x: options.sizeX,
              y: options.sizeY,
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
            x: options.sizeX,
            y: options.sizeY,
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
    }
  }, [dashboardId]);

  useEffect(() => {
    if (dashboardId) {
      fetchLayoutData();
    }
  }, [dashboardId]);

  const onLayoutChange = async (layout: Layout[]) => {
    clearTimeout(layoutChangeTimeout.current);

    const dataVisualization = dataLayouts
      .filter((e) => e.type === WIDGET_TYPE.VISUALIZATION)
      .map((item) => {
        const newLayout = layout.filter((e) => e.i === item.id);
        return {
          id: item.id,
          options: {
            sizeX: newLayout[0].x,
            sizeY: newLayout[0].y,
            col: newLayout[0].w,
            row: newLayout[0].h,
          },
        };
      });
    const dataTextWidget = dataLayouts
      .filter((e) => e.type === WIDGET_TYPE.TEXT)
      .map((item) => {
        const newLayout = layout.filter((e) => e.i === item.id);
        return {
          id: item.id,
          options: {
            sizeX: newLayout[0].x,
            sizeY: newLayout[0].y,
            col: newLayout[0].w,
            row: newLayout[0].h,
          },
        };
      });

    // many widgets are changed at one time so need to update the latest change
    layoutChangeTimeout.current = setTimeout(async () => {
      try {
        const payload = {
          dashboardVisuals: dataVisualization,
          textWidgets: dataTextWidget,
        };
        const res = await rf
          .getRequest('DashboardsRequest')
          .updateDashboardItem(payload, dashboardId);
        if (res) {
          fetchLayoutData();
        }
      } catch (e) {
        toastError({ message: getErrorMessage(e) });
      }
    }, 500);
  };

  const _renderEmptyDashboard = () => (
    <Flex
      className="empty-dashboard"
      justifyContent={'center'}
      alignItems={'center'}
    >
      Dashboard is empty
    </Flex>
  );

  return (
    <div className="workspace-page__editor__dashboard">
      <Header
        type={LIST_ITEM_TYPE.DASHBOARDS}
        author={''}
        data={dataDashboard}
        needAuthentication={false}
      />
      <div className="dashboard-container">
        <Box className="header-tab">
          <div className="header-tab__info">
            <AppNetworkIcons
              networkIds={['eth_goerli', 'bsc_testnet', 'polygon_mainet']}
            />
            {['defi', 'gas', 'dex'].map((item) => (
              <AppTag key={item} value={item} />
            ))}
          </div>
        </Box>
        {!!dataLayouts.length && (
          <ResponsiveGridLayout
            onLayoutChange={onLayoutChange}
            className="main-grid-layout"
            layouts={{ lg: dataLayouts }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 12, sm: 12, xs: 6, xxs: 4 }}
            isDraggable={false}
            isResizable={false}
            measureBeforeMount
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
        )}
        {isEmptyDashboard && _renderEmptyDashboard()}
        <ModalForkDashBoardDetails
          dashboardId={dashboardId}
          open={openModalFork}
          onClose={() => setOpenModalFork(false)}
        />
      </div>
    </div>
  );
};

export default DashboardPart;