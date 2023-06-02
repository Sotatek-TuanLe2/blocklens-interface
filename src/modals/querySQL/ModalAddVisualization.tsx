import { Checkbox, Flex, Link, Text } from '@chakra-ui/react';
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
import { TYPE_VISUALIZATION, VisualizationType } from 'src/utils/query.type';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError, toastSuccess } from 'src/utils/utils-notify';
import BaseModal from '../BaseModal';
import { debounce } from 'lodash';
import { INPUT_DEBOUNCE } from 'src/utils/common';

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
  item: any;
  i: VisualizationType;
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
  const [dataVisualization, setDataVisualization] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const dataFilter = useMemo(
    () =>
      dataVisualization?.filter(
        (el) =>
          el.name && el.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
        .getMyListQueries(params);
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

        <div className="main-queries">
          {!!dataFilter.length ? (
            dataFilter?.map(
              (item) =>
                item?.visualizations &&
                item?.visualizations?.map((i: any, index: number) => (
                  <Flex key={`${item.id}-${index}`}>
                    <AddVisualizationCheckbox
                      userName={userName}
                      item={item}
                      i={i}
                      getIcon={getIcon}
                      setSelectedItems={setSelectedItems}
                      selectedItems={selectedItems}
                    />
                  </Flex>
                )),
            )
          ) : (
            <div className="no-data">No data</div>
          )}
        </div>
        <Flex className="modal-footer">
          <AppButton variant="cancel" mr={2.5} size="lg" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton
            disabled={!dataVisualization.length}
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
  item,
  i,
  getIcon,
  selectedItems,
  setSelectedItems,
}) => {
  const checkAdded = selectedItems.some((el) => el.id === i.id);

  const conditionDisplayIcon = () => {
    if (i.type === 'table') {
      return i.type;
    } else if (i.type === 'counter') {
      return i.type;
    } else {
      return i.options.globalSeriesType;
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
        item.visualizations.find((item: { id: string }) => item.id === itemId),
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
          onChange={(e) => handleCheckboxChange(e, i.id)}
          isChecked={checkAdded}
        />
        {getIcon(conditionDisplayIcon())}
        <Link className="visualization-name">{i.name}</Link>
        <Text className="user-name">
          @{userName} / {item.name}
        </Text>
      </Flex>
    </>
  );
};
