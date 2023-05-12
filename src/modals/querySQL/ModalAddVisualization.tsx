import { Flex, Link, Text, Tooltip } from '@chakra-ui/react';
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
import { ILayout } from 'src/pages/DashboardDetailPage';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/BaseModal.scss';
import {
  QueryType,
  TYPE_VISUALIZATION,
  VisualizationType,
} from 'src/utils/query.type';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';
import BaseModal from '../BaseModal';
import { debounce } from 'lodash';
import { INPUT_DEBOUNCE } from 'src/utils/common';

interface IModalAddVisualization {
  open: boolean;
  onClose: () => void;
  userName: string;
  setOpenModalFork: React.Dispatch<React.SetStateAction<boolean>>;
  dataLayouts: ILayout[];
  onReload: () => Promise<void>;
  dashboardId: string;
}
interface IButtonAdd {
  userName: string;
  item: any;
  dataLayouts: ILayout[];
  handleRemoveVisualization: (
    item: ILayout[],
    i: VisualizationType,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => Promise<void>;
  handleSaveVisualization: (
    data: QueryType,
    visualizations: VisualizationType,
  ) => Promise<void>;
  i: VisualizationType;
  getIcon: (chain: string | undefined) => JSX.Element;
}

const ModalAddVisualization: React.FC<IModalAddVisualization> = ({
  open,
  onClose,
  userName,
  setOpenModalFork,
  dataLayouts,
  onReload,
  dashboardId,
}) => {
  const [dataVisualization, setDataVisualization] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const dataFilter = useMemo(
    () =>
      dataVisualization?.filter((el) =>
        el.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [dataVisualization, searchTerm],
  );

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value.trim());
    },
    INPUT_DEBOUNCE,
  );

  const fetchVisualization = async () => {
    const params = {};
    try {
      const res = await rf
        .getRequest('DashboardsRequest')
        .getListBrowseQueries(params);
      if (res) {
        setDataVisualization(res.data);
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
    } else {
      setSearchTerm('');
    }
  }, [open]);

  const handleSaveVisualization = async (
    data: QueryType,
    visualizations: VisualizationType,
  ) => {
    try {
      const payload = {
        dashboardId,
        visualizationId: visualizations.id,
        text: visualizations.name,
        options: {
          sizeX: dataLayouts.length % 2 === 0 ? 0 : 6,
          sizeY: 2,
          col: 6,
          row: 2,
        },
      };
      const res = await rf
        .getRequest('DashboardsRequest')
        .addVisualization(payload);
      if (res) {
        onReload();
      }
    } catch (e) {
      toastError({ message: getErrorMessage(e) });
    }
  };

  const handleRemoveVisualization = async (
    item: ILayout[],
    i: VisualizationType,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    try {
      const result = item.map((e: any) => {
        if (e.content.id === i.id) {
          return e.id;
        }
      });
      const removeId = result.find((item: any) => item !== undefined);

      e.preventDefault();
      await rf.getRequest('DashboardsRequest').removeVisualization(removeId);
      onReload();
      fetchVisualization();
      // onClose();
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
    >
      <form className="main-modal-dashboard-details">
        <AppInput
          onChange={handleSearch}
          onKeyPress={(e) => {
            e.key === 'Enter' && e.preventDefault();
          }}
          mt={'10px'}
          size="sm"
          placeholder="Search your queries"
        />

        <div className="main-queries">
          {!!dataFilter.length ? (
            dataFilter?.map(
              (item) =>
                item?.visualizations &&
                item?.visualizations?.map((i: any, index: number) => (
                  <Flex
                    justifyContent={'space-between'}
                    borderBottom={'1px solid white'}
                    key={`${item.id}-${index}`}
                  >
                    <ButtonAdd
                      userName={userName}
                      item={item}
                      dataLayouts={dataLayouts}
                      handleSaveVisualization={handleSaveVisualization}
                      handleRemoveVisualization={handleRemoveVisualization}
                      i={i}
                      getIcon={getIcon}
                    />
                  </Flex>
                )),
            )
          ) : (
            <div className="no-data">No data</div>
          )}
        </div>
        <Flex className="modal-footer">
          <AppButton size="sm" onClick={onClose}>
            Done
          </AppButton>
          <AppButton
            size="sm"
            variant={'cancel'}
            onClick={() => setOpenModalFork(true)}
          >
            New dashboard
          </AppButton>
        </Flex>
      </form>
    </BaseModal>
  );
};

export default ModalAddVisualization;

const ButtonAdd: React.FC<IButtonAdd> = ({
  userName,
  item,
  handleSaveVisualization,
  handleRemoveVisualization,
  dataLayouts,
  i,
  getIcon,
}) => {
  const checkAdded = dataLayouts.map((el: any) => el.content.id).includes(i.id);
  const conditionDisplayIcon = () => {
    if (i.type === 'table') {
      return i.type;
    } else if (i.type === 'counter') {
      return i.type;
    } else {
      return i.options.globalSeriesType;
    }
  };
  return (
    <>
      <Flex className="visualization-row" alignItems={'center'}>
        {getIcon(conditionDisplayIcon())}
        <Tooltip label={`${userName}/${item.name}`} hasArrow>
          <Link className="user-name">
            @{userName} / {item.name}
          </Link>
        </Tooltip>

        <Tooltip label={i.name} hasArrow>
          <Text className="visualization-name">
            {i.options.globalSeriesType}{' '}
            {i.name === 'Table' ? 'Query results' : i.name}
          </Text>
        </Tooltip>
      </Flex>
      <Text
        onClick={(e: any) => {
          checkAdded
            ? handleRemoveVisualization(dataLayouts, i, e)
            : handleSaveVisualization(item, i);
        }}
        className={checkAdded ? 'btn-added-query' : 'btn-add-query'}
      >
        {checkAdded ? 'Added' : 'Add'}
      </Text>
    </>
  );
};
