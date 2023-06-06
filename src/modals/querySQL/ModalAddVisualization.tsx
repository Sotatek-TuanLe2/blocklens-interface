import { Checkbox, Flex, Link, Spinner, Text } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  AreaChartIcon,
  BarChartIcon,
  CounterIcon,
  LineChartIcon,
  PieChartIcon,
  QueryResultIcon,
  ScatterChartIcon,
} from 'src/assets/icons';
import { AppButton, AppInput } from 'src/components';
import { ILayout } from 'src/pages/WorkspacePage/parts/Dashboard';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/BaseModal.scss';
import {
  IQuery,
  TYPE_VISUALIZATION,
  VisualizationType,
} from 'src/utils/query.type';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import BaseModal from '../BaseModal';
import _, { debounce } from 'lodash';
import { INPUT_DEBOUNCE, IPagination } from 'src/utils/common';
import InfiniteScroll from 'react-infinite-scroll-component';

interface IModalAddVisualization {
  open: boolean;
  onClose: () => void;
  userName: string;
  dataLayouts: ILayout[];
  onReload: () => Promise<void>;
  dashboardId: string;
}
interface IAddVisualizationCheckbox {
  userName: string;
  query: IQuery;
  visualization: VisualizationType;
  getIcon: (chain: string | undefined) => JSX.Element;
  selectedItems: any[];
  setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
}

const ModalAddVisualization: React.FC<IModalAddVisualization> = ({
  open,
  onClose,
  userName,
  dataLayouts,
  onReload,
  dashboardId,
}) => {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [myQueries, setMyQueries] = useState<IQuery[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [dataVisualPagination, setDataVisualPagination] = useState<
    IPagination | undefined
  >();

  const filteredVisualizations: Array<{
    visualization: VisualizationType;
    query: IQuery;
  }> = useMemo(() => {
    const result: Array<{ visualization: VisualizationType; query: IQuery }> =
      [];
    myQueries.forEach((query) => {
      if (query.visualizations) {
        query.visualizations.forEach((visualization) => {
          result.push({ visualization, query });
        });
      }
    });

    return searchTerm
      ? result.filter(
          (item) =>
            item.query.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.visualization.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
        )
      : result;
  }, [myQueries, searchTerm]);

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value.trim());
    },
    INPUT_DEBOUNCE,
  );

  const fetchInfiniteScrollVisual = async () => {
    try {
      const res = await rf.getRequest('DashboardsRequest').getMyListQueries(
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
      toastError({ message: getErrorMessage(error) });
    }
  };

  const fetchVisualization = async () => {
    const params = {};
    try {
      const res = await rf
        .getRequest('DashboardsRequest')
        .getMyListQueries(params);
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
      toastError({
        message: getErrorMessage(error),
      });
    }
  };

  useEffect(() => {
    if (open) {
      fetchVisualization();
      setSelectedItems(
        dataLayouts.filter((i) => i.type !== 'text').map((el) => el.content),
      );
    } else {
      setSearchTerm('');
    }
  }, [open]);

  useEffect(() => {
    if (!!dataLayouts.length) {
      setSelectedItems(
        dataLayouts.filter((i) => i.type !== 'text').map((el) => el.content),
      );
    }
  }, [dataLayouts]);

  const handleSaveVisualization = async () => {
    const dataVisual = selectedItems.map((i) => {
      return {
        visualizationId: i.id,
        options: {
          sizeX: dataLayouts.length % 2 === 0 ? 0 : 6,
          sizeY: dataLayouts.length,
          col: 6,
          row: 2,
        },
      };
    });
    try {
      const payload = {
        dashboardId,
        listVisuals: dataVisual,
      };
      await rf.getRequest('DashboardsRequest').manageVisualizations(payload);
      toastSuccess({ message: 'Update successfully' });
      onClose();
      onReload();
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
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
        return (
          <>
            <QueryResultIcon />
          </>
        );
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
            {!!filteredVisualizations.length ? (
              filteredVisualizations?.map((item, index) => (
                <Flex
                  key={`${item.query.id}-${item.visualization.id}-${index}`}
                >
                  <AddVisualizationCheckbox
                    userName={userName}
                    query={item.query}
                    visualization={item.visualization}
                    getIcon={getIcon}
                    setSelectedItems={setSelectedItems}
                    selectedItems={selectedItems}
                  />
                </Flex>
              ))
            ) : (
              <div className="no-data">No data</div>
            )}
          </InfiniteScroll>
        </div>
        <Flex className="modal-footer">
          <AppButton variant="cancel" mr={2.5} size="lg" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton
            disabled={!myQueries.length}
            size="lg"
            onClick={() => {
              handleSaveVisualization();
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
  query,
  visualization,
  getIcon,
  selectedItems,
  setSelectedItems,
}) => {
  const checkAdded = selectedItems.some((el) => el.id === visualization.id);

  const conditionDisplayIcon = () => {
    if (visualization.type === 'table' || visualization.type === 'counter') {
      return visualization.type;
    } else {
      return visualization.options.globalSeriesType;
    }
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    itemId: string,
  ) => {
    const { checked } = event.target;

    if (checked) {
      setSelectedItems((prevItems) => [
        ...prevItems,
        query.visualizations.find((item: { id: string }) => item.id === itemId),
      ]);
    } else {
      setSelectedItems((prevItems) =>
        prevItems.filter((selectedItem) => selectedItem.id !== itemId),
      );
    }
  };

  return (
    <>
      <Flex className="visualization-row" alignItems={'center'}>
        <Checkbox
          onChange={(e) => handleCheckboxChange(e, visualization.id)}
          isChecked={checkAdded}
        />
        {getIcon(conditionDisplayIcon())}
        <Link className="visualization-name">{visualization.name}</Link>
        <Text className="user-name">
          @{userName} / {query.name}
        </Text>
      </Flex>
    </>
  );
};
