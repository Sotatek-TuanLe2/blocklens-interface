import { useParams } from 'react-router-dom';
import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import ReactMarkdown from 'react-markdown';
import 'react-resizable/css/styles.css';
import PlusIcon from 'src/assets/icons/icon-plus.png';
import { AppTag } from 'src/components';
import useUser from 'src/hooks/useUser';
import ModalAddTextWidget from 'src/modals/querySQL/ModalAddTextWidget';
import ModalAddVisualization from 'src/modals/querySQL/ModalAddVisualization';
import ModalEditItemDashBoard from 'src/modals/querySQL/ModalEditItemDashBoard';
import ModalForkDashBoardDetails from 'src/modals/querySQL/ModalForkDashBoardDetails';
import ModalSettingDashboardDetails from 'src/modals/querySQL/ModalSettingDashboardDetails';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/TableValue.scss';
import 'src/styles/pages/DashboardDetailPage.scss';
import 'src/styles/components/Chart.scss';
import 'src/styles/components/AppQueryMenu.scss';
import { IDashboardDetail } from 'src/utils/query.type';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import VisualizationItem from './VisualizationItem';
import Header from './Header';
import AppNetworkIcons from 'src/components/AppNetworkIcons';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import { AppBroadcast } from 'src/utils/utils-broadcast';

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

export const BROADCAST_FETCH_DASHBOARD = 'FETCH_DASHBOARD';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardPart: React.FC = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();

  const { user } = useUser();

  const [editMode, setEditMode] = useState<boolean>(false);
  const [dataLayouts, setDataLayouts] = useState<ILayout[]>([]);
  const [dataDashboard, setDataDashboard] = useState<IDashboardDetail>();
  const [selectedItem, setSelectedItem] = useState<ILayout>(Object);
  const [typeModalTextWidget, setTypeModalTextWidget] = useState<string>(``);
  const [openModalAddVisualization, setOpenModalAddVisualization] =
    useState<boolean>(false);
  const [openModalFork, setOpenModalFork] = useState<boolean>(false);
  const [openModalSetting, setOpenModalSetting] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalAddTextWidget, setOpenModalAddTextWidget] =
    useState<boolean>(false);
  const [isEmptyDashboard, setIsEmptyDashboard] = useState<boolean>(false);

  const layoutChangeTimeout = useRef() as any;

  const userName =
    `${user?.getFirstName() || ''}` + `${user?.getLastName() || ''}`;

  const fetchLayoutData = useCallback(async () => {
    try {
      const res = await rf
        .getRequest('DashboardsRequest')
        .getMyDashboardById({ dashboardId });
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
    AppBroadcast.on(BROADCAST_FETCH_DASHBOARD, fetchLayoutData);

    return () => {
      AppBroadcast.remove(BROADCAST_FETCH_DASHBOARD);
    };
  }, []);

  useEffect(() => {
    if (dashboardId) {
      fetchLayoutData();
    }
  }, [dashboardId]);

  const onOpenModalAddText = () => {
    setTypeModalTextWidget(TYPE_MODAL.ADD);
    setOpenModalAddTextWidget(true);
  };

  const onOpenModalAddVisualization = () => setOpenModalAddVisualization(true);

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
      <div className="add-widget" onClick={onOpenModalAddVisualization}>
        <div className="icon-widget-big-visualization" />
        Add Visualization
      </div>
      <div className="add-widget" onClick={onOpenModalAddText}>
        <div className="icon-widget-big-text" />
        Add Text Widget
      </div>
    </Flex>
  );

  return (
    <div className="workspace-page__editor__dashboard">
      <Header
        type={LIST_ITEM_TYPE.DASHBOARDS}
        author={user?.getFirstName() || ''}
        data={dataDashboard}
        isEdit={editMode}
        onChangeEditMode={() => setEditMode((prevState) => !prevState)}
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
          {editMode && (
            <Menu>
              <MenuButton className="app-query-menu">
                <Box className="add-button">
                  <img src={PlusIcon} alt="icon-plus" />
                </Box>
              </MenuButton>
              <MenuList className="app-query-menu__list">
                <MenuItem onClick={onOpenModalAddVisualization}>
                  <Flex alignItems={'center'} gap={'8px'}>
                    <span className="icon-widget-small-visualization" />
                    Add visualization
                  </Flex>
                </MenuItem>
                <MenuItem onClick={onOpenModalAddText}>
                  <Flex alignItems={'center'} gap={'8px'}>
                    <span className="icon-widget-small-text" />
                    Add text widget
                  </Flex>
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Box>
        {!!dataLayouts.length && (
          <ResponsiveGridLayout
            onLayoutChange={onLayoutChange}
            className="main-grid-layout"
            layouts={{ lg: dataLayouts }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 12, sm: 12, xs: 6, xxs: 4 }}
            isDraggable={editMode}
            isResizable={editMode}
            measureBeforeMount
          >
            {dataLayouts.map((item) => (
              <div className="box-layout" key={item.id}>
                <div className="box-chart">
                  {item.type === WIDGET_TYPE.VISUALIZATION ? (
                    <VisualizationItem visualization={item.content} />
                  ) : (
                    <div className="box-text-widget">
                      <ReactMarkdown>{item.text}</ReactMarkdown>
                    </div>
                  )}
                </div>
                {editMode && (
                  <Flex
                    alignItems={'center'}
                    className="widget-buttons"
                    columnGap={'12px'}
                  >
                    {item.type === WIDGET_TYPE.TEXT && (
                      <Box
                        className="icon-query-edit"
                        onClick={() => {
                          setTypeModalTextWidget(TYPE_MODAL.EDIT);
                          setSelectedItem(item);
                          setOpenModalAddTextWidget(true);
                        }}
                      />
                    )}
                    <Box
                      className="icon-query-delete"
                      onClick={() => {
                        setSelectedItem(item);
                        setOpenModalEdit(true);
                      }}
                    />
                  </Flex>
                )}
              </div>
            ))}
          </ResponsiveGridLayout>
        )}
        {isEmptyDashboard && _renderEmptyDashboard()}
        <ModalSettingDashboardDetails
          open={openModalSetting}
          onClose={() => setOpenModalSetting(false)}
          dataDashboard={dataDashboard}
          onReload={fetchLayoutData}
        />
        <ModalAddTextWidget
          selectedItem={selectedItem}
          dataLayouts={dataLayouts}
          type={typeModalTextWidget}
          open={openModalAddTextWidget}
          onClose={() => setOpenModalAddTextWidget(false)}
          onReload={fetchLayoutData}
          dataDashboard={dataDashboard}
        />
        <ModalEditItemDashBoard
          selectedItem={selectedItem}
          onReload={fetchLayoutData}
          open={openModalEdit}
          onClose={() => setOpenModalEdit(false)}
        />
        {openModalAddVisualization && (
          <ModalAddVisualization
            dashboardId={dashboardId}
            dataLayouts={dataLayouts}
            open={openModalAddVisualization}
            onClose={() => setOpenModalAddVisualization(false)}
            userName={userName}
            onReload={fetchLayoutData}
          />
        )}

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
