import { Box, Flex, Link, Spinner, Text, Tooltip } from '@chakra-ui/react';
import _, { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  AreaChartIcon,
  BarChartIcon,
  CounterIcon,
  LineChartIcon,
  PieChartIcon,
  QueryResultIcon,
  RadioChecked,
  RadioNoCheckedIcon,
  ScatterChartIcon,
} from 'src/assets/icons';
import { AppButton, AppInput } from 'src/components';
import { ILayout, WIDGET_TYPE } from 'src/pages/WorkspacePage/parts/Dashboard';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/BaseModal.scss';
import { INPUT_DEBOUNCE, IPagination } from 'src/utils/common';
import {
  IQuery,
  TYPE_VISUALIZATION,
  VisualizationType,
} from 'src/utils/query.type';
import { toastSuccess } from 'src/utils/utils-notify';
import BaseModal from '../BaseModal';
import { FadeLoader } from 'react-spinners';

export const WIDTH_DASHBOARD = [
  {
    name: 'Small',
    col: 3,
    width: '25%',
  },
  {
    name: 'Medium',
    col: 6,
    width: '50%',
  },
  {
    name: 'Large',
    col: 12,
    width: '100%',
  },
];

export const TOTAL_COL = 12;

interface IModalAddVisualization {
  open: boolean;
  userName: string;
  dataLayouts: ILayout[];
  dashboardId: string;
  onClose: () => void;
  onSave: (layouts: ILayout[]) => void;
}
interface IAddVisualizationCheckbox {
  userName: string;
  visualization: IListMyQueries;
  getIcon: (chain: string | undefined) => JSX.Element;
  visualSelected: VisualizationType;
  setVisualSelected: (value: VisualizationType | string) => void;
}

interface IListMyQueries {
  id: string;
  type: string;
  name: string;
  queryId: string;
  options: any;
  createdAt: string;
  updatedAt: string;
  query: IQuery;
}

const ModalAddVisualization: React.FC<IModalAddVisualization> = ({
  open,
  userName,
  dataLayouts,
  onClose,
  onSave,
}) => {
  const [visualSelected, setVisualSelected] = useState<any>('');
  const [myQueries, setMyQueries] = useState<IListMyQueries[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [widthWidget, setWidthWidget] = useState<number>(TOTAL_COL / 2);
  const [dataVisualPagination, setDataVisualPagination] = useState<
    IPagination | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value.trim());
    },
    INPUT_DEBOUNCE,
  );

  const fetchInfiniteScrollVisual = async () => {
    try {
      const res = await rf
        .getRequest('DashboardsRequest')
        .getListMyQueriesVisualizations(
          _.omitBy(
            {
              search: searchTerm.trim(),
              page: (dataVisualPagination?.currentPage || 1) + 1,
            },
            (param) => !param,
          ),
        );
      if (res) {
        const { itemsPerPage, totalPages, totalItem, currentPage } = res;
        setMyQueries((pre) => [...pre, ...res.data]);
        setDataVisualPagination({
          itemsPerPage,
          totalPages,
          currentPage,
          totalItem,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVisualization = async () => {
    const params = {
      search: searchTerm || undefined,
    };
    setIsLoading(true);
    try {
      const res = await rf
        .getRequest('DashboardsRequest')
        .getListMyQueriesVisualizations(params);
      if (res) {
        const { itemsPerPage, totalPages, totalItem, currentPage } = res;
        setMyQueries(res.data);
        setDataVisualPagination({
          itemsPerPage,
          totalPages,
          currentPage,
          totalItem,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisualization().then();
  }, [searchTerm]);

  useEffect(() => {
    if (visualSelected?.type === TYPE_VISUALIZATION.table) {
      setWidthWidget(TOTAL_COL);
    } else if (visualSelected?.type === TYPE_VISUALIZATION.counter) {
      setWidthWidget(TOTAL_COL / 4);
    } else {
      setWidthWidget(TOTAL_COL / 2);
    }
  }, [visualSelected]);

  const handleSaveVisualization = async (widthWidget: number) => {
    const lastLayout = _.maxBy(dataLayouts, 'y');
    const currentY = lastLayout?.y || 0;
    const listWidgetCurrent = dataLayouts.filter(
      (layout) => layout.y === currentY,
    );

    const totalWidthWidget = _.sumBy(listWidgetCurrent, 'w');

    let sizeX = 0;
    let sizeY = 0;

    if (totalWidthWidget < TOTAL_COL) {
      sizeY = currentY || 0;
      sizeX = totalWidthWidget;
    } else {
      sizeY = currentY + 2;
      sizeX = 0;
    }

    const selectedItem = myQueries.find(
      (item) => item.id === (visualSelected as VisualizationType).id,
    );

    const newId = Date.now().toString();
    const newVisualization = {
      x: sizeX,
      y: sizeY,
      w: widthWidget,
      h: 2,
      i: newId,
      id: newId,
      type: WIDGET_TYPE.VISUALIZATION,
      content: { ...visualSelected, query: selectedItem?.query },
    };

    onSave([...dataLayouts, newVisualization]);
    onClose();
    toastSuccess({ message: 'Add successfully' });
  };

  const getIcon = (chain: string | undefined) => {
    switch (chain) {
      case TYPE_VISUALIZATION.table:
        return <QueryResultIcon />;

      case TYPE_VISUALIZATION.scatter:
        return <ScatterChartIcon />;

      case TYPE_VISUALIZATION.area:
        return <AreaChartIcon />;

      case TYPE_VISUALIZATION.line: {
        return <LineChartIcon />;
      }
      case TYPE_VISUALIZATION.pie:
        return <PieChartIcon />;

      case TYPE_VISUALIZATION.bar:
        return <BarChartIcon />;

      case TYPE_VISUALIZATION.counter:
        return <CounterIcon />;

      default:
        return <QueryResultIcon />;
    }
  };

  return (
    <BaseModal
      isOpen={open}
      onClose={onClose}
      size="lg"
      className="modal-add-visualization"
      title="Add Visualization"
    >
      <form className="main-modal-dashboard-details">
        <AppInput
          onChange={handleSearch}
          onKeyPress={(e) => {
            e.key === 'Enter' && e.preventDefault();
          }}
          mt={'10px'}
          size="sm"
          placeholder="Find chart..."
        />

        <div className="main-queries" id="main-queries">
          <InfiniteScroll
            className="infinite-scroll"
            scrollThreshold={1}
            dataLength={myQueries.length}
            next={fetchInfiniteScrollVisual}
            hasMore={
              (dataVisualPagination?.currentPage || 0) <
              (dataVisualPagination?.totalPages || 0)
            }
            loader={
              <Flex justifyContent={'center'}>
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="md"
                />
              </Flex>
            }
            scrollableTarget="main-queries"
          >
            {isLoading ? (
              <Flex
                align={'center'}
                justify={'center'}
                w={'full'}
                h={'full'}
                pos={'absolute'}
                top={0}
                left={0}
              >
                <FadeLoader
                  cssOverride={{
                    transform: 'scale(0.4) translateY(-35px)',
                    transformOrigin: 'center',
                  }}
                  color="rgba(0, 2, 36, 0.8)"
                />{' '}
                Loading
              </Flex>
            ) : (
              <>
                {!!myQueries.length ? (
                  myQueries.map((item, index) => (
                    <Flex key={`${item.query.id}-${item.id}-${index}`}>
                      <AddVisualizationCheckbox
                        userName={userName}
                        visualization={item}
                        getIcon={getIcon}
                        setVisualSelected={setVisualSelected}
                        visualSelected={visualSelected}
                      />
                    </Flex>
                  ))
                ) : (
                  <Flex
                    pos={'absolute'}
                    top={0}
                    left={0}
                    w={'full'}
                    h={'full'}
                    className="no-data"
                  >
                    No data
                  </Flex>
                )}
              </>
            )}
          </InfiniteScroll>
        </div>

        <Flex
          pt={5}
          fontSize={'14px'}
          alignItems={{ base: 'flex-start', md: 'center' }}
        >
          Width:
          <Flex
            ml={{ base: 2, md: 3 }}
            flexDirection={{ base: 'column', md: 'row' }}
          >
            {WIDTH_DASHBOARD.map((item, index) => {
              return (
                <Flex
                  mr={{ base: 2, md: 3 }}
                  onClick={() => setWidthWidget(item.col)}
                  cursor={'pointer'}
                  key={index}
                  mb={{ base: 3, md: 0 }}
                >
                  {widthWidget === item.col ? (
                    <RadioChecked />
                  ) : (
                    <RadioNoCheckedIcon />
                  )}
                  <Flex ml={2} alignItems={'center'}>
                    {item.name}{' '}
                    <Box as={'span'} fontSize={'14px'} ml={1}>
                      ({item.width})
                    </Box>
                  </Flex>
                </Flex>
              );
            })}
          </Flex>
        </Flex>
        <Flex className="modal-footer">
          <AppButton
            variant="cancel"
            mr={2.5}
            size="lg"
            onClick={onClose}
            className="btn-cancel"
          >
            Cancel
          </AppButton>
          <AppButton
            disabled={!myQueries.length || !visualSelected}
            size="lg"
            onClick={() => {
              handleSaveVisualization(widthWidget).then();
              onClose();
            }}
          >
            Confirm
          </AppButton>
        </Flex>
      </form>
    </BaseModal>
  );
};

export default ModalAddVisualization;

const AddVisualizationCheckbox: React.FC<IAddVisualizationCheckbox> = ({
  userName,
  visualization,
  getIcon,
  visualSelected,
  setVisualSelected,
}) => {
  const conditionDisplayIcon = () => {
    if (visualization.type === 'table' || visualization.type === 'counter') {
      return visualization.type;
    } else {
      return visualization.options.globalSeriesType;
    }
  };

  const handleCheckboxChange = (data: IListMyQueries) => {
    if (visualSelected?.id === data.id) {
      setVisualSelected('');
    } else {
      setVisualSelected(data);
    }
  };

  return (
    <>
      <Flex className="visualization-row" alignItems={'center'}>
        <Flex
          alignItems={'center'}
          mr={10}
          onClick={() => handleCheckboxChange(visualization)}
          cursor={'pointer'}
        >
          {visualSelected?.id === visualization.id ? (
            <RadioChecked />
          ) : (
            <RadioNoCheckedIcon />
          )}
          {getIcon(conditionDisplayIcon())}
          <Link className="visualization-name">
            <Tooltip label={visualization.name}>{visualization.name}</Tooltip>
          </Link>
          <Text className="user-name">
            <Tooltip label={`@${userName} / ${visualization.query.name}`}>
              {`@${userName} / ${visualization.query.name}`}
            </Tooltip>
          </Text>
        </Flex>
      </Flex>
    </>
  );
};
