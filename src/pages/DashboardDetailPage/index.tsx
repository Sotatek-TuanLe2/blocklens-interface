import { Avatar, Box, Flex } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import ReactMarkdown from 'react-markdown';
import 'react-resizable/css/styles.css';
import { useParams } from 'react-router-dom';
import { PenIcon } from 'src/assets/icons';
import { AppButton } from 'src/components';

import useUser from 'src/hooks/useUser';
import { BasePage } from 'src/layouts';
import ModalAddTextWidget from 'src/modals/ModalAddTextWidget';
import ModalAddVisualization from 'src/modals/ModalAddVisualization';
import ModalEditItemDashBoard from 'src/modals/ModalEditItemDashBoard';
import ModalForkDashBoardDetails from 'src/modals/ModalForkDashBoardDetails';
import ModalSettingDashboardDetails from 'src/modals/ModalSettingDashboardDetails';
import ModalShareDashboardDetails from 'src/modals/ModalShareDashboardDetails';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/TableValue.scss';
import 'src/styles/pages/DashboardDetailPage.scss';

import 'src/styles/components/Chart.scss';
import { IQuery } from 'src/utils/query.type';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import VisualizationItem from './parts/VisualizationItem';

interface ParamTypes {
  authorId: string;
  dashboardId: string;
  queryId: string;
}

interface IButtonModalFork {
  openModalFork: boolean;
  setOpenModalFork: React.Dispatch<React.SetStateAction<boolean>>;
  authorId: string;
}

export interface ILayout extends Layout {
  options: any;
  i: string;
  id: string;
  visualizationWidgets: [];
  text: string;
  visualization: any;
  content: any;
}
export enum TYPE_MODAL {
  ADD = 'add',
  EDIT = 'edit',
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardDetailPage: React.FC = () => {
  const { authorId, dashboardId } = useParams<ParamTypes>();
  const { user } = useUser();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [dataLayouts, setDataLayouts] = useState<ILayout[]>([]);
  const [dataDashboard, setDataDashboard] = useState<IQuery>();
  const [layoutChange, setLayoutChange] = useState<Layout[]>([]);
  const [selectedItem, setSelectedItem] = useState<ILayout>(Object);
  const [typeModalTextWidget, setTypeModalTextWidget] = useState<string>(``);

  const [openModalAddVisualization, setOpenModalAddVisualization] =
    useState<boolean>(false);
  const [openModalFork, setOpenModalFork] = useState<boolean>(false);
  const [openModalSetting, setOpenModalSetting] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalAddTextWidget, setOpenModalAddTextWidget] =
    useState<boolean>(false);
  const userName =
    `${user?.getFirstName() || ''}` + `${user?.getLastName() || ''}`;

  const fetchLayoutData = useCallback(async () => {
    try {
      const res = await rf
        .getRequest('DashboardsRequest')
        .getDashboardById({ dashboardId });
      if (res) {
        const visualization = res.visualizationWidgets.map((item: ILayout) => {
          const { options } = item;
          return {
            x: options.sizeX,
            y: options.sizeY,
            w: options.col,
            h: options.row,
            i: item.id,
            id: item.id,
            content: item.visualization,
          };
        });
        const textWidgets = res.textWidgets.map((item: ILayout) => {
          const { options } = item;

          return {
            x: options.sizeX,
            y: options.sizeY,
            w: options.col,
            h: options.row,
            i: item.id,
            id: item.id,
            text: item.text,
            content: {},
          };
        });
        setDataDashboard(res);
        setDataLayouts(visualization.concat(textWidgets));
      }
    } catch (error) {
      toastError({
        message: getErrorMessage(error),
      });
    }
  }, [dashboardId]);

  useEffect(() => {
    fetchLayoutData();
  }, []);

  const _renderButtons = () => {
    const isAccountsDashboard = true;
    const editButtons = [
      { title: 'Settings', setModal: setOpenModalSetting },
      { title: 'Add text widget', setModal: setOpenModalAddTextWidget },
      { title: 'Add visualization', setModal: setOpenModalAddVisualization },
    ];

    return (
      <Flex gap={'10px'}>
        {editMode ? (
          editButtons.map((item, index) => (
            <AppButton
              className="btn-cancel"
              key={index}
              size={'sm'}
              onClick={() => {
                if (item.title === 'Add text widget') {
                  setTypeModalTextWidget(TYPE_MODAL.ADD);
                }
                item.setModal(true);
              }}
            >
              {item.title}
            </AppButton>
          ))
        ) : (
          <>
            {isAccountsDashboard && (
              <ButtonModalFork
                openModalFork={openModalFork}
                setOpenModalFork={setOpenModalFork}
                authorId={authorId}
              />
            )}
            <ButtonShare />
          </>
        )}
        {isAccountsDashboard && (
          <AppButton
            className={editMode ? 'btn-save' : 'btn-cancel'}
            size={'sm'}
            onClick={() => {
              if (editMode) {
                updateItem(layoutChange);
                setEditMode(false);
              } else {
                setEditMode(true);
              }
            }}
          >
            {editMode ? 'Done' : 'Edit'}
          </AppButton>
        )}
      </Flex>
    );
  };

  const updateItem = async (layout: Layout[]) => {
    const newWidget = (type: string) =>
      dataLayouts.filter((e) =>
        type === 'visualization'
          ? e.content.hasOwnProperty('id')
          : !e.content.hasOwnProperty('id'),
      );

    const dataVisualization = newWidget('visualization').map((item) => {
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
    const dataTextWidget = newWidget('text').map((item) => {
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
    try {
      const payload = {
        visualizationWidgets: dataVisualization,
        textWidgets: dataTextWidget,
      };
      const res = await rf
        .getRequest('DashboardsRequest')
        .updateDashboardItem(payload, dashboardId);
      if (res) {
        setDataLayouts(res);
        fetchLayoutData();
      }
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  const onLayoutChange = (layout: Layout[]) => {
    setLayoutChange(layout);
  };
  return (
    <BasePage isFullWidth>
      <div className="main-content-dashboard-details">
        <header className="main-header-dashboard-details">
          <Flex gap={2}>
            <Avatar name={user?.getFirstName()} size="sm" />
            <div>
              <div className="dashboard-name">
                @{userName} / {dataDashboard?.name || ''}
              </div>
            </div>
          </Flex>
          {_renderButtons()}
        </header>

        {!!dataLayouts.length ? (
          <ResponsiveGridLayout
            onLayoutChange={onLayoutChange}
            className="main-grid-layout"
            layouts={{ lg: dataLayouts }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            isDraggable={editMode}
            isResizable={editMode}
            measureBeforeMount
          >
            {dataLayouts.map((item) => (
              <div className="box-layout" key={item.id}>
                <div className="box-chart">
                  {item.content.hasOwnProperty('id') ? (
                    <>
                      <VisualizationItem visualization={item.content} />
                    </>
                  ) : (
                    <div className="box-text-widget">
                      <ReactMarkdown>{item.text}</ReactMarkdown>
                    </div>
                  )}
                </div>

                {editMode ? (
                  <Box
                    className="btn-edit"
                    onClick={() => {
                      setTypeModalTextWidget(TYPE_MODAL.EDIT);
                      setSelectedItem(item);
                      item.content.hasOwnProperty('id')
                        ? setOpenModalEdit(true)
                        : setOpenModalAddTextWidget(true);
                    }}
                  >
                    <PenIcon />
                  </Box>
                ) : null}
              </div>
            ))}
          </ResponsiveGridLayout>
        ) : (
          <Flex
            width={'full'}
            height={'calc(100vh - 118px);'}
            justifyContent={'center'}
            alignItems={'center'}
          >
            This dashboard is empty.
          </Flex>
        )}

        <ModalSettingDashboardDetails
          url={dashboardId}
          authorId={authorId}
          open={openModalSetting}
          onClose={() => setOpenModalSetting(false)}
        />
        <ModalAddTextWidget
          dashboardId={dashboardId}
          selectedItem={selectedItem}
          dataLayouts={dataLayouts}
          setDataLayouts={setDataLayouts}
          type={typeModalTextWidget}
          open={openModalAddTextWidget}
          onClose={() => setOpenModalAddTextWidget(false)}
          onReload={fetchLayoutData}
          dataDashboard={dataDashboard}
        />
        <ModalEditItemDashBoard
          selectedItem={selectedItem}
          dataLayouts={dataLayouts}
          setDataLayouts={setDataLayouts}
          onReload={fetchLayoutData}
          open={openModalEdit}
          onClose={() => setOpenModalEdit(false)}
        />
        <ModalAddVisualization
          dashboardId={dashboardId}
          dataLayouts={dataLayouts}
          setDataLayouts={setDataLayouts}
          setOpenModalFork={setOpenModalFork}
          open={openModalAddVisualization}
          onClose={() => setOpenModalAddVisualization(false)}
          userName={userName}
          onReload={fetchLayoutData}
        />
      </div>
    </BasePage>
  );
};

export default DashboardDetailPage;

const ButtonModalFork: React.FC<IButtonModalFork> = ({
  openModalFork,
  setOpenModalFork,
  authorId,
}) => {
  return (
    <>
      <AppButton
        className="btn-cancel"
        size={'sm'}
        onClick={() => setOpenModalFork(true)}
      >
        Fork
      </AppButton>
      <ModalForkDashBoardDetails
        authorId={authorId}
        open={openModalFork}
        onClose={() => setOpenModalFork(false)}
      />
    </>
  );
};

const ButtonShare: React.FC = () => {
  const [openModalShare, setOpenModalShare] = useState<boolean>(false);

  return (
    <>
      <AppButton
        className="btn-cancel"
        size={'sm'}
        onClick={() => setOpenModalShare(true)}
      >
        Share
      </AppButton>
      <ModalShareDashboardDetails
        open={openModalShare}
        onClose={() => setOpenModalShare(false)}
      />
    </>
  );
};
