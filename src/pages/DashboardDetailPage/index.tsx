import { Avatar, Box, Flex } from '@chakra-ui/react';
import moment from 'moment';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import ReactMarkdown from 'react-markdown';
import 'react-resizable/css/styles.css';
import { useParams } from 'react-router-dom';
import { PenIcon } from 'src/assets/icons';
import { AppButton } from 'src/components';
import { PieChart, VisualizationTable } from 'src/components/Charts';

import VisualizationCounter from 'src/components/Charts/VisualizationCounter';
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

import VisualizationChart from 'src/components/Charts/VisualizationChart';
import 'src/styles/components/Chart.scss';
import {
  IQuery,
  QueryResultResponse,
  TYPE_VISUALIZATION,
  VisualizationType,
} from 'src/utils/query.type';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';

let flag = false;
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
  id: number;
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
    // user?.getId() === authorId;
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
const VisualizationItem = React.memo(
  ({ visualization }: { visualization: VisualizationType }) => {
    const editorRef = useRef<any>();
    const [queryResult, setQueryResult] = useState<unknown[]>([]);

    const queryId = visualization?.query?.id;
    const defaultTimeXAxis = useMemo(() => {
      let result = '';
      const firstResultInQuery: any =
        queryResult && !!queryResult.length ? queryResult[0] : null;
      if (firstResultInQuery) {
        Object.keys(firstResultInQuery).forEach((key: string) => {
          const date = moment(firstResultInQuery[key]);
          if (date.isValid() && isNaN(+firstResultInQuery[key])) {
            result = key;
            return;
          }
        });
      }
      return result;
    }, [queryResult]);
    const fetchQueryResult = async (executionId: string) => {
      const res = await rf.getRequest('DashboardsRequest').getQueryResult({
        queryId,
        executionId,
      });

      let fetchQueryResultInterval: any = null;
      if (res.status !== 'DONE') {
        fetchQueryResultInterval = setInterval(async () => {
          const resInterval = await rf
            .getRequest('DashboardsRequest')
            .getQueryResult({
              queryId,
              executionId,
            });
          if (resInterval.status === 'DONE') {
            clearInterval(fetchQueryResultInterval);
            setQueryResult(resInterval.result);
          }
        }, 2000);
      } else {
        setQueryResult(res.result);
      }
    };
    const fetchQuery = async () => {
      try {
        const dataQuery = await rf
          .getRequest('DashboardsRequest')
          .getQueryById({ queryId });
        // set query into editor
        const position = editorRef.current.editor.getCursorPosition();
        editorRef.current.editor.setValue('');
        editorRef.current.editor.session.insert(position, dataQuery?.query);
      } catch (error) {
        getErrorMessage(error);
      }
    };

    const fetchInitialData = useCallback(async () => {
      if (flag) return;

      try {
        const res: QueryResultResponse = await rf
          .getRequest('DashboardsRequest')
          .getQueryExecutionId({
            queryId,
          });

        await fetchQueryResult(res.resultId);
        await fetchQuery();
        flag = true;
      } catch (error) {
        getErrorMessage(error);
      }
    }, [queryId, queryResult]);

    useEffect(() => {
      if (queryId) {
        fetchInitialData();
      }
    }, [queryId, queryResult]);

    const renderVisualization = (visualization: VisualizationType) => {
      const type =
        visualization.options?.globalSeriesType || visualization.type;
      let data = [...queryResult];
      if (visualization.options?.xAxisConfigs?.sortX) {
        data = data.sort((a: any, b: any) => {
          if (moment(a[visualization.options.columnMapping.xAxis]).isValid()) {
            return moment
              .utc(a[visualization.options.columnMapping.xAxis])
              .diff(moment.utc(b[visualization.options.columnMapping.xAxis]));
          }
          return (
            a[visualization.options?.columnMapping.xAxis] -
            b[visualization.options?.columnMapping.xAxis]
          );
        });
      }
      if (visualization.options?.xAxisConfigs?.reverseX) {
        data = data.reverse();
      }

      let errorMessage = null;
      let visualizationDisplay = null;

      if (!visualization.options?.columnMapping?.xAxis) {
        errorMessage = 'Missing x-axis';
      } else if (!visualization.options?.columnMapping?.yAxis.length) {
        errorMessage = 'Missing y-axis';
      } else {
        // TODO: check yAxis values have same type
      }

      switch (type) {
        case TYPE_VISUALIZATION.table:
          errorMessage = null;
          visualizationDisplay = (
            <VisualizationTable
              data={queryResult}
              dataColumn={visualization.options.columns}
            />
          );

          break;
        case TYPE_VISUALIZATION.counter:
          errorMessage = null;
          visualizationDisplay = (
            <VisualizationCounter
              data={queryResult}
              visualization={visualization}
            />
          );

          break;
        case TYPE_VISUALIZATION.pie:
          visualizationDisplay = (
            <PieChart
              data={queryResult}
              xAxisKey={
                visualization.options?.columnMapping?.xAxis || defaultTimeXAxis
              }
              yAxisKeys={visualization.options.columnMapping?.yAxis || []}
              configs={visualization.options}
            />
          );
          break;
        default:
          // chart

          visualizationDisplay = (
            <VisualizationChart
              data={queryResult}
              xAxisKey={
                visualization.options?.columnMapping?.xAxis || defaultTimeXAxis
              }
              yAxisKeys={visualization.options.columnMapping?.yAxis || []}
              configs={visualization.options}
              type={type}
            />
          );
      }

      return (
        <>
          <div className="visual-container__visualization">
            <div className="visual-container__visualization__title">
              {visualization.name}
            </div>
            {errorMessage ? (
              <Flex
                alignItems={'center'}
                justifyContent={'center'}
                className="visual-container__visualization__error"
              >
                {errorMessage}
              </Flex>
            ) : (
              visualizationDisplay
            )}
          </div>
        </>
      );
    };

    return renderVisualization(visualization);
  },
);
