import { useParams } from 'react-router-dom';
import { Avatar, Box, Flex } from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import ReactMarkdown from 'react-markdown';
import 'react-resizable/css/styles.css';
import { PenIcon } from 'src/assets/icons';
import PlusIcon from 'src/assets/icons/icon-plus.png';
import { AppButton, AppTag } from 'src/components';
import useUser from 'src/hooks/useUser';
import ModalAddTextWidget from 'src/modals/querySQL/ModalAddTextWidget';
import ModalAddVisualization from 'src/modals/querySQL/ModalAddVisualization';
import ModalEditItemDashBoard from 'src/modals/querySQL/ModalEditItemDashBoard';
import ModalForkDashBoardDetails from 'src/modals/querySQL/ModalForkDashBoardDetails';
import ModalSettingDashboardDetails from 'src/modals/querySQL/ModalSettingDashboardDetails';
import ModalShareDashboardDetails from 'src/modals/ModalShareDashboardDetails';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/TableValue.scss';
import 'src/styles/pages/DashboardDetailPage.scss';

import 'src/styles/components/Chart.scss';
import { IDashboardDetail } from 'src/utils/query.type';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import VisualizationItem from './VisualizationItem';
import ModalEmptyDashboard from 'src/modals/querySQL/ModalEmptyDashboard';
import Header from './Header';
import { WORKSPACE_TYPES } from '..';
import AppNetworkIcons from 'src/components/AppNetworkIcons';

export interface ILayout extends Layout {
  options: any;
  i: string;
  id: string;
  dashboardVisuals: [];
  text: string;
  visualization: any;
  content: any;
}
export enum TYPE_MODAL {
  ADD = 'add',
  EDIT = 'edit',
}

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
  const [openModalEmptyDashboard, setOpenModalEmptyDashboard] =
    useState<boolean>(false);

  const layoutChangeTimeout = useRef() as any;

  const userName =
    `${user?.getFirstName() || ''}` + `${user?.getLastName() || ''}`;

  const fetchLayoutData = useCallback(async () => {
    try {
      const res = await rf
        .getRequest('DashboardsRequest')
        .getDashboardById({ dashboardId });
      if (res) {
        const visualization = res.dashboardVisuals.map((item: ILayout) => {
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

        const layouts = visualization.concat(textWidgets);
        setDataDashboard(res);
        setDataLayouts(layouts);
        setOpenModalEmptyDashboard(!layouts.length);
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

  // const _renderButtons = () => {
  //   const isAccountsDashboard = true;
  //   const editButtons = [
  //     { title: 'Settings', setModal: setOpenModalSetting },
  //     { title: 'Add text widget', setModal: setOpenModalAddTextWidget },
  //     { title: 'Add visualization', setModal: setOpenModalAddVisualization },
  //   ];

  //   return (
  //     <Flex gap={'10px'}>
  //       {editMode ? (
  //         editButtons.map((item, index) => (
  //           <AppButton
  //             className="btn-cancel"
  //             key={index}
  //             size={'sm'}
  //             onClick={() => {
  //               if (item.title === 'Add text widget') {
  //                 setTypeModalTextWidget(TYPE_MODAL.ADD);
  //               }
  //               item.setModal(true);
  //             }}
  //           >
  //             {item.title}
  //           </AppButton>
  //         ))
  //       ) : (
  //         <>
  //           {isAccountsDashboard && (
  //             <ButtonModalFork
  //               openModalFork={openModalFork}
  //               setOpenModalFork={setOpenModalFork}
  //             />
  //           )}
  //           <ButtonShare />
  //         </>
  //       )}
  //       {isAccountsDashboard && (
  //         <AppButton
  //           className={editMode ? 'btn-save' : 'btn-cancel'}
  //           size={'sm'}
  //           onClick={() => setEditMode((prevState) => !prevState)}
  //         >
  //           {editMode ? 'Done' : 'Edit'}
  //         </AppButton>
  //       )}
  //     </Flex>
  //   );
  // };

  const onLayoutChange = async (layout: Layout[]) => {
    clearTimeout(layoutChangeTimeout.current);
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

  return (
    <div className="workspace-page__editor__dashboard">
      <Header
        type={WORKSPACE_TYPES.DASHBOARD}
        author={user?.getFirstName() || ''}
        title={dataDashboard?.name || ''}
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
        </Box>
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
        <Box className="float-add-button">
          <img src={PlusIcon} alt="icon-plus" />
        </Box>
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
        <ModalAddVisualization
          dashboardId={dashboardId}
          dataLayouts={dataLayouts}
          open={openModalAddVisualization}
          onClose={() => setOpenModalAddVisualization(false)}
          userName={userName}
          onReload={fetchLayoutData}
        />
        <ModalForkDashBoardDetails
          dashboardId={dashboardId}
          open={openModalFork}
          onClose={() => setOpenModalFork(false)}
        />
        <ModalEmptyDashboard
          open={openModalEmptyDashboard}
          onAddText={() => {
            setTypeModalTextWidget(TYPE_MODAL.ADD);
            setOpenModalAddTextWidget(true);
          }}
          onAddVisualization={() => {
            setOpenModalAddVisualization(true);
          }}
        />
      </div>
    </div>
  );
};

export default DashboardPart;

// const ButtonModalFork: React.FC<{
//   openModalFork: boolean;
//   setOpenModalFork: React.Dispatch<React.SetStateAction<boolean>>;
// }> = ({ setOpenModalFork }) => {
//   return (
//     <>
//       <AppButton
//         className="btn-cancel"
//         size={'sm'}
//         onClick={() => setOpenModalFork(true)}
//       >
//         Fork
//       </AppButton>
//     </>
//   );
// };

// const ButtonShare: React.FC = () => {
//   const [openModalShare, setOpenModalShare] = useState<boolean>(false);

//   return (
//     <>
//       <AppButton
//         className="btn-cancel"
//         size={'sm'}
//         onClick={() => setOpenModalShare(true)}
//       >
//         Share
//       </AppButton>
//       <ModalShareDashboardDetails
//         open={openModalShare}
//         onClose={() => setOpenModalShare(false)}
//       />
//     </>
//   );
// };
