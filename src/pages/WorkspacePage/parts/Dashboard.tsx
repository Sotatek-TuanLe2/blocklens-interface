import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import ReactMarkdown from 'react-markdown';
import 'react-resizable/css/styles.css';
import { Prompt, useParams } from 'react-router-dom';
import { DeleteIcon, EditIcon } from 'src/assets/icons';
import PlusIcon from 'src/assets/icons/icon-plus.png';
import useUser from 'src/hooks/useUser';
import ModalAddTextWidget from 'src/modals/querySQL/ModalAddTextWidget';
import ModalAddVisualization from 'src/modals/querySQL/ModalAddVisualization';
import ModalDeleteWidget from 'src/modals/querySQL/ModalDeleteWidget ';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';
import { LoadingFullPage } from 'src/pages/LoadingFullPage';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/AppQueryMenu.scss';
import 'src/styles/components/Chart.scss';
import 'src/styles/components/TableValue.scss';
import 'src/styles/pages/DashboardDetailPage.scss';
import {
  IDashboardDetail,
  ITextWidget,
  IVisualizationWidget,
} from 'src/utils/query.type';
import { AppBroadcast } from 'src/utils/utils-broadcast';
import { Dashboard } from 'src/utils/utils-dashboard';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import Header from './Header';
import VisualizationItem from './VisualizationItem';

export interface ILayout extends Layout {
  id: string;
  text?: string;
  type: string;
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
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalAddTextWidget, setOpenModalAddTextWidget] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSavingDashboard, setIsSavingDashboard] = useState<boolean>(false);
  const [isEmptyDashboard, setIsEmptyDashboard] = useState<boolean>(true);

  const userName =
    `${user?.getFirstName() || ''}` + `${user?.getLastName() || ''}`;

  const fetchLayoutData = async (id?: string) => {
    try {
      setIsLoading(true);
      const res = await rf
        .getRequest('DashboardsRequest')
        .getMyDashboardById({ dashboardId: id || dashboardId });
      if (res) {
        const visualization: ILayout[] = res.dashboardVisuals.map(
          (item: IVisualizationWidget) => {
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
        const textWidgets: ILayout[] = res.textWidgets.map(
          (item: ITextWidget) => {
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
          },
        );

        const layouts = visualization.concat(textWidgets);
        setDataDashboard(res);
        setDataLayouts(layouts);
        setIsEmptyDashboard(!layouts.length);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    AppBroadcast.on(BROADCAST_FETCH_DASHBOARD, fetchLayoutData);

    return () => {
      AppBroadcast.remove(BROADCAST_FETCH_DASHBOARD);
    };
  }, []);

  useEffect(() => {
    window.onbeforeunload = () => {
      if (editMode) {
        return ``;
      }
    };

    return () => {
      window.onbeforeunload = null;
    };
  }, [editMode]);

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

  const onOpenModalAddText = () => {
    setTypeModalTextWidget(TYPE_MODAL.ADD);
    setOpenModalAddTextWidget(true);
  };

  const onOpenModalAddVisualization = () => setOpenModalAddVisualization(true);

  const onLayoutChange = async (layout: Layout[]) => {
    setDataLayouts((prevState) => {
      const newDataLayouts: ILayout[] = prevState.map((item) => {
        const newLayout = layout.find((e) => e.i === item.id);
        if (!newLayout) {
          return item;
        }
        return {
          ...item,
          x: newLayout.x,
          y: newLayout.y,
          w: newLayout.w,
          h: newLayout.h,
        };
      });
      return newDataLayouts;
    });
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

  const updateDashboard = async () => {
    setIsSavingDashboard(true);
    const dataVisualization = dataLayouts
      .filter((e) => e.type === WIDGET_TYPE.VISUALIZATION)
      .map((item) => {
        return {
          id: item.id,
          options: {
            sizeX: item.x,
            sizeY: item.y,
            col: item.w,
            row: item.h,
          },
          visualizationId: item.content.id,
        };
      });
    const dataTextWidget = dataLayouts
      .filter((e) => e.type === WIDGET_TYPE.TEXT)
      .map((item) => {
        return {
          id: item.id,
          options: {
            sizeX: item.x,
            sizeY: item.y,
            col: item.w,
            row: item.h,
          },
          text: item.text,
        };
      });

    try {
      const payload = {
        dashboardVisuals: dataVisualization,
        textWidgets: dataTextWidget,
      };
      await rf
        .getRequest('DashboardsRequest')
        .updateDashboardItem(payload, dashboardId);
      setIsSavingDashboard(false);
      await fetchLayoutData();
    } catch (e) {
      setIsSavingDashboard(false);
      toastError({ message: getErrorMessage(e) });
    }
  };

  const onChangeEditMode = async () => {
    if (editMode) {
      await updateDashboard();
    }
    setEditMode((prevState) => !prevState);
  };

  const onSaveDataLayouts = (layouts: ILayout[]) => {
    setDataLayouts(layouts);
    setEditMode(true);
  };

  const _renderDashboard = () => {
    if (!dataLayouts.length) {
      return _renderEmptyDashboard();
    }

    return (
      <ResponsiveGridLayout
        onLayoutChange={onLayoutChange}
        className="main-grid-layout"
        layouts={{ lg: dataLayouts }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 12, xs: 6, xxs: 4 }}
        isDraggable={editMode}
        isResizable={editMode}
        measureBeforeMount
        containerPadding={[0, 30]}
        margin={[20, 20]}
      >
        {dataLayouts.map((item) => (
          <div className="box-layout" key={item.id}>
            <div className={`box-chart ${editMode ? 'box-chart--edit' : ''}`}>
              {item.type === WIDGET_TYPE.VISUALIZATION ? (
                <VisualizationItem
                  editMode={editMode}
                  visualization={item.content}
                />
              ) : (
                <div
                  className={`box-text-widget ${
                    editMode ? 'box-text-widget--edit' : ''
                  }`}
                >
                  <ReactMarkdown>{item.text || ''}</ReactMarkdown>
                </div>
              )}
            </div>
            {editMode && (
              <Flex
                alignItems={'flex-start'}
                className="widget-buttons"
                columnGap={'12px'}
              >
                {item.type === WIDGET_TYPE.TEXT && (
                  <Box
                    onClick={() => {
                      setTypeModalTextWidget(TYPE_MODAL.EDIT);
                      setSelectedItem(item);
                      setOpenModalAddTextWidget(true);
                    }}
                  >
                    <EditIcon />
                  </Box>
                )}
                <Box
                  onClick={() => {
                    setSelectedItem(item);
                    setOpenModalEdit(true);
                  }}
                >
                  <DeleteIcon />
                </Box>
              </Flex>
            )}
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
            ? `${dashboardClass?.getUserFirstName()} ${dashboardClass?.getUserLastName()}`
            : ''
        }
        data={dataDashboard}
        isEdit={editMode}
        isLoadingRun={isLoading || isSavingDashboard}
        isEmptyDashboard={isEmptyDashboard && !dataLayouts.length}
        onChangeEditMode={onChangeEditMode}
      />
      {isLoading ? (
        <LoadingFullPage />
      ) : (
        <div className="dashboard-container">
          {_renderDashboard()}
          {editMode && !!dataLayouts.length && (
            <Menu>
              <MenuButton className="app-query-menu add-button">
                <img src={PlusIcon} alt="icon-plus" />
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
          <ModalAddTextWidget
            selectedItem={selectedItem}
            dataLayouts={dataLayouts}
            type={typeModalTextWidget}
            open={openModalAddTextWidget}
            onClose={() => setOpenModalAddTextWidget(false)}
            onSave={onSaveDataLayouts}
          />
          <ModalDeleteWidget
            selectedItem={selectedItem}
            dataLayouts={dataLayouts}
            open={openModalEdit}
            onSave={onSaveDataLayouts}
            onClose={() => setOpenModalEdit(false)}
          />
          {openModalAddVisualization && (
            <ModalAddVisualization
              dashboardId={dashboardId}
              dataLayouts={dataLayouts}
              open={openModalAddVisualization}
              userName={userName}
              onSave={onSaveDataLayouts}
              onClose={() => setOpenModalAddVisualization(false)}
            />
          )}
          <Prompt
            when={editMode}
            message={`Your dashboard is not saved yet\nAre you sure you want to leave?`}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardPart;
