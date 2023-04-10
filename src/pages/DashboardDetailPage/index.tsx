import { Avatar, Badge, Box, Flex } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import ReactMarkdown from 'react-markdown';
import 'react-resizable/css/styles.css';
import { useParams } from 'react-router-dom';
import { ActiveStarIcon, PenIcon, StarIcon } from 'src/assets/icons';
import { AppButton } from 'src/components';
import VisualizationAreaChart from 'src/components/Charts/AreaChart';
import VisualizationBarChart from 'src/components/Charts/BarChart';
import VisualizationLineChart from 'src/components/Charts/LineChart';
import VisualizationPieChart from 'src/components/Charts/PieChart';
import TableSqlValue from 'src/components/Charts/TableSqlValue';
import useUser from 'src/hooks/useUser';
import ModalAddTextWidget from 'src/modals/ModalAddTextWidget';
import ModalAddVisualization from 'src/modals/ModalAddVisualization';
import ModalEditItemDashBoard from 'src/modals/ModalEditItemDashBoard';
import ModalForkDashBoardDetails from 'src/modals/ModalForkDashBoardDetails';
import ModalSettingDashboardDetails from 'src/modals/ModalSettingDashboardDetails';
import ModalShareDashboardDetails from 'src/modals/ModalShareDashboardDetails';
import DashboardsRequest from 'src/requests/DashboardsRequest';
import rf from 'src/requests/RequestFactory';
import 'src/styles/pages/DashboardDetailPage.scss';
import { QueryTypeSingle, TYPE_VISUALIZATION } from 'src/utils/common';
import { getErrorMessage } from 'src/utils/utils-helper';
import { objectKeys } from 'src/utils/utils-network';
import { toastError } from 'src/utils/utils-notify';

interface ParamTypes {
  authorId: string;
  dashboardId: string;
}

interface IButtonModalFork {
  openModalFork: boolean;
  setOpenModalFork: React.Dispatch<React.SetStateAction<boolean>>;
  authorId: string;
}

export interface ILayout extends Layout {
  i: string;
  id: number;
  content: [];
  meta: Layout;
}
export enum TYPE_MODAL {
  ADD = 'add',
  EDIT = 'edit',
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const hashTag: string[] = ['zkSync', 'bridge', 'l2'];

const DashboardDetailPage: React.FC = () => {
  const { authorId, dashboardId } = useParams<ParamTypes>();
  const { user } = useUser();
  const [isInitialMount, setIsInitialMount] = useState(true);
  const [isUpdate, setIsUpdate] = useState<boolean>(true);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [dataLayouts, setDataLayouts] = useState<ILayout[]>([]);
  const [queryValues, setQueryValues] = useState<unknown[]>([]);
  const [selectedItem, setSelectedItem] = useState<ILayout>(Object);
  const [typeModalTextWidget, setTypeModalTextWidget] = useState<string>(``);

  const [openModalAddVisualization, setOpenModalAddVisualization] =
    useState<boolean>(false);
  const [openModalFork, setOpenModalFork] = useState<boolean>(false);
  const [openModalSetting, setOpenModalSetting] = useState<boolean>(false);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalAddTextWidget, setOpenModalAddTextWidget] =
    useState<boolean>(false);

  const userName = `${user?.getFirstName()}` + `${user?.getLastName()}`;

  const fetchLayoutData = useMemo(
    () => async () => {
      try {
        const res = await rf.getRequest('DashboardsRequest').getDashboardItem();

        const layouts = res.map((item: ILayout) => {
          const { meta } = item;
          return {
            x: meta.x,
            y: meta.y,
            w: meta.w,
            h: meta.h,
            i: meta.i,
            id: item.id,
            content: item.content,
          };
        });
        setDataLayouts(layouts);
      } catch (error) {
        toastError({
          message: getErrorMessage(error),
        });
      }
    },
    [dataLayouts],
  );

  const fetchQueryResults = async () => {
    try {
      const dashboardsRequest = new DashboardsRequest();
      const queryValues = await dashboardsRequest.getQueriesValues();
      setQueryValues(queryValues);
    } catch (err) {
      getErrorMessage(err);
    }
  };

  useEffect(() => {
    fetchLayoutData();
    fetchQueryResults();
  }, []);

  const tableValuesColumnConfigs = useMemo(() => {
    const columns =
      Array.isArray(queryValues) && queryValues[0]
        ? objectKeys(queryValues[0])
        : [];

    return columns.map((col) => ({
      id: col,
      accessorKey: col,
      header: col,
      enableResizing: true,
      size: 100,
    }));
  }, [queryValues]);

  const renderVisualization = (type: string) => {
    switch (type) {
      case TYPE_VISUALIZATION.table:
        return (
          <TableSqlValue
            columns={tableValuesColumnConfigs as typeof queryValues}
            data={queryValues}
          />
        );
      case TYPE_VISUALIZATION.line:
        return (
          <VisualizationLineChart
            data={queryValues}
            xAxisKey="time"
            yAxisKeys={['size']}
          />
        );
      case TYPE_VISUALIZATION.column:
        return (
          <VisualizationBarChart
            data={queryValues}
            xAxisKey="time"
            yAxisKeys={['size']}
          />
        );
      case TYPE_VISUALIZATION.area:
        return (
          <VisualizationAreaChart
            data={queryValues}
            xAxisKey="time"
            yAxisKeys={['size']}
          />
        );
      case TYPE_VISUALIZATION.pie:
        return <VisualizationPieChart data={queryValues} dataKey={'number'} />;
      default:
      // return <AddVisualization onAddVisualize={addVisualizationHandler} />;
    }
  };

  const _renderButtons = () => {
    const isAccountsDashboard = user?.getId() === authorId;
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
            <ButtonVoteStar />
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
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Done' : 'Edit'}
          </AppButton>
        )}
      </Flex>
    );
  };

  const checkTypeVisualization = (data: QueryTypeSingle[]) => {
    return data.map((i) =>
      i.visualizations.type === 'table'
        ? i.visualizations.type
        : i.visualizations.type === 'chart'
        ? i.visualizations.options.globalSeriesType
        : null,
    );
  };

  async function processGetItems(ids: number[]) {
    const results = [];
    for (const id of ids) {
      const result = await removeItem(id);
      results.push(result);
    }
    return results;
  }

  async function removeItem(id: number) {
    return rf.getRequest('DashboardsRequest').removeDashboardItem(id);
  }

  async function processAddItem(
    newLayout: {
      id: number;
      content: [];
      meta: Layout;
    }[],
  ) {
    const results = [];
    for (const layout of newLayout) {
      const result = await addDashboardItem(layout);
      results.push(result);
    }
    return results;
  }

  async function addDashboardItem(id: {
    id: number;
    content: [];
    meta: Layout;
  }) {
    return rf.getRequest('DashboardsRequest').addDashboardItem(id);
  }

  const updateItem = async (layout: Layout[]) => {
    const ids = dataLayouts.map((e) => e.id);
    const newLayout = dataLayouts.map((item, index) => ({
      id: item.id,
      content: item.content,
      meta: layout[index],
    }));

    const processResults = await processGetItems(ids);
    if (processResults.every((result) => !!result.id)) {
      try {
        const processResults2 = await processAddItem(newLayout);
        if (processResults2.every((result) => !!result.id)) {
          fetchLayoutData();
        }
      } catch (err) {
        toastError({ message: getErrorMessage(err) });
      }
    }
  };

  const onLayoutChange = (layout: Layout[]) => {
    if (!isInitialMount && isUpdate) {
      setIsUpdate(true);
      updateItem(layout);
    } else {
      setIsInitialMount(false);
    }
  };
  return (
    <div className="main-content-dashboard-details">
      <header className="main-header-dashboard-details">
        <Flex gap={2}>
          <Avatar name={user?.getFirstName()} size="sm" />
          <div>
            <div className="dashboard-name">
              @{userName} / {dashboardId}
            </div>
            <Flex gap={1} pt={'10px'}>
              {hashTag.map((item) => (
                <Badge size={'sm'} key={item}>
                  #{item}
                </Badge>
              ))}
            </Flex>
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
        >
          {dataLayouts.map((item) => (
            <div className="box-layout" key={item.i}>
              {item.content.length > 0 ? (
                <>
                  {renderVisualization(
                    checkTypeVisualization(item.content).toString(),
                  )}
                </>
              ) : (
                <ReactMarkdown>{item.i}</ReactMarkdown>
              )}
              {editMode ? (
                <Box
                  className="btn-edit"
                  onClick={() => {
                    setTypeModalTextWidget(TYPE_MODAL.EDIT);
                    setSelectedItem(item);
                    item.content.length > 0
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
        hashTag={hashTag}
        onClose={() => setOpenModalSetting(false)}
      />
      <ModalAddTextWidget
        selectedItem={selectedItem}
        dataLayouts={dataLayouts}
        setDataLayouts={setDataLayouts}
        type={typeModalTextWidget}
        open={openModalAddTextWidget}
        onClose={() => setOpenModalAddTextWidget(false)}
        onReload={fetchLayoutData}
        setIsUpdate={setIsUpdate}
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
        dataLayouts={dataLayouts}
        setDataLayouts={setDataLayouts}
        setOpenModalFork={setOpenModalFork}
        open={openModalAddVisualization}
        onClose={() => {
          setOpenModalAddVisualization(false);
          setIsUpdate(true);
        }}
        userName={userName}
        onReload={fetchLayoutData}
        setIsUpdate={setIsUpdate}
      />
    </div>
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

const ButtonVoteStar: React.FC = () => {
  const [voteStar, setVoteStar] = useState<boolean>(false);
  const [totalVote, setTotalVote] = useState<number>(2);

  return (
    <AppButton
      onClick={() => {
        setTotalVote(!voteStar ? totalVote + 1 : totalVote - 1);
        setVoteStar(!voteStar);
      }}
      className="btn-cancel"
      size={'sm'}
      rightIcon={!voteStar ? <StarIcon /> : <ActiveStarIcon />}
      w={'60px'}
    >
      {totalVote}
    </AppButton>
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
