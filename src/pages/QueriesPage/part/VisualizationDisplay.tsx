import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import TableSqlValue from '../../../components/Charts/TableSqlValue';
import VisualizationBarChart from '../../../components/Charts/BarChart';
import { AppButton, AppSelect2 } from '../../../components';
import VisualizationAreaChart from '../../../components/Charts/AreaChart';
import AppTabs from '../../../components/AppTabs';
import { objectKeys } from '../../../utils/utils-network';
import VisualizationLineChart from '../../../components/Charts/LineChart';
import ChartSettings from '../../../components/SqlEditor/ChartSettings';
import VisualizationPieChart from '../../../components/Charts/PieChart';
import {
  QueryType,
  TYPE_VISUALIZATION,
  VALUE_VISUALIZATION,
  VisualizationType,
} from '../../../utils/common';
import DashboardsRequest from '../../../requests/DashboardsRequest';
import { useParams } from 'react-router-dom';
import BaseModal from '../../../modals/BaseModal';

type VisualizationConfigType = {
  value: string;
  label: string;
  type: string;
};

const visualizationConfigs: VisualizationConfigType[] = [
  {
    value: VALUE_VISUALIZATION.query,
    label: 'Query',
    type: TYPE_VISUALIZATION.table,
  },
  {
    label: 'Bar chart',
    type: TYPE_VISUALIZATION.bar,
    value: VALUE_VISUALIZATION.bar,
  },
  {
    label: 'Line chart',
    type: TYPE_VISUALIZATION.line,
    value: VALUE_VISUALIZATION.line,
  },
  {
    label: 'Area chart',
    type: TYPE_VISUALIZATION.area,
    value: VALUE_VISUALIZATION.area,
  },
  {
    label: 'Pie chart',
    type: TYPE_VISUALIZATION.pie,
    value: VALUE_VISUALIZATION.pie,
  },
];

type Props = {
  queryValues: unknown[];
  queryInfo: QueryType;
};

const VisualizationDisplay = ({ queryValues, queryInfo }: Props) => {
  const { queryId } = useParams<{ queryId: string }>();
  const [visualizationsActive, setVisualizationsActive] = useState<
    VisualizationType[]
  >([{ id: '1', options: {}, name: 'New Visualization', type: '' }]);
  const [closeTabId, setCloseTabId] = useState('');

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

  const addVisualizationToQuery = async (
    queryId: string,
    updateQuery: Partial<QueryType>,
  ) => {
    const request = new DashboardsRequest();
    await request.updateQuery(queryId, updateQuery);
  };

  const addVisualizationHandler = async (visualizationValue: string) => {
    const searchedVisualization = visualizationConfigs.find(
      (v) => v.value === visualizationValue,
    );
    if (!searchedVisualization) return;
    let newVisualization: VisualizationType = {} as VisualizationType;
    if (searchedVisualization.type === 'table') {
      newVisualization = {
        name: 'Table',
        id: (Math.floor(Math.random() * 100) + 1).toString(),
        type: 'table',
        options: {},
      };
    } else {
      newVisualization = {
        id: (Math.floor(Math.random() * 100) + 1).toString(),
        name: 'Chart',
        type: 'chart',
        options: {
          globalSeriesType: searchedVisualization.type,
          columnMapping: {
            time: 'x',
            number: 'y',
          },
          showLegend: true,
        },
      };
    }

    const updateQuery = {
      ...queryInfo,
      visualizations: [...queryInfo.visualizations, newVisualization],
    };
    await addVisualizationToQuery(queryId, updateQuery);
    setVisualizationsActive((prevState) => {
      const [queryResult, ...others] = prevState;
      return [queryResult, newVisualization, ...others];
    });
  };

  const removeVisualizationHandler = async (visualizationId: string) => {
    const visualizationIndex = queryInfo.visualizations.findIndex(
      (v) => v.id.toString() === visualizationId.toString(),
    );
    if (visualizationIndex === -1) return;
    const updateQuery = {
      ...queryInfo,
      visualizations: queryInfo.visualizations.filter(
        (v) => v.id !== visualizationId,
      ),
    };
    await addVisualizationToQuery(queryId, updateQuery);
    setVisualizationsActive([
      ...updateQuery.visualizations,
      {
        id: 'newVisualization',
        options: {},
        name: 'New Visualization',
        type: 'newVisualization',
      },
    ]);
  };

  useEffect(() => {
    setVisualizationsActive([
      ...queryInfo.visualizations,
      {
        id: 'newVisualization',
        options: {},
        name: 'New Visualization',
        type: 'newVisualization',
      },
    ]);
  }, []);

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
        return <AddVisualization onAddVisualize={addVisualizationHandler} />;
    }
  };

  return (
    <Box height={'500px'} overflow={'auto'}>
      <AppTabs
        onCloseTab={(tabId) => {
          // setOpenRemoveTabModal(true);
          setCloseTabId(tabId);
        }}
        tabs={visualizationsActive.map((v) => ({
          name: v.name,
          content: renderVisualization(v.options.globalSeriesType || v.type),
          id: v.id,
          closeable: v.type !== 'newVisualization',
        }))}
      />
      <ChartSettings />
      <BaseModal
        title={'Remove visualization'}
        description={'Are you sure you want to remove this visualization?'}
        isOpen={closeTabId !== ''}
        onClose={() => setCloseTabId('')}
        onActionLeft={() => setCloseTabId('')}
        onActionRight={() => {
          removeVisualizationHandler(closeTabId);
          setCloseTabId('');
        }}
      >
        <></>
      </BaseModal>
    </Box>
  );
};

export default VisualizationDisplay;

type AddVisualizationProps = {
  onAddVisualize: (visualizationValue: string) => void;
};

const AddVisualization = ({ onAddVisualize }: AddVisualizationProps) => {
  const [visualizationSelected, setVisualizationSelected] = useState<string>();
  return (
    <Box>
      <Text mb={2}>Select visualization type</Text>
      <AppSelect2
        options={visualizationConfigs}
        value={visualizationSelected || ''}
        onChange={(value) => setVisualizationSelected(value)}
      />

      <AppButton
        mt={4}
        onClick={() => {
          if (!visualizationSelected) return;
          onAddVisualize(visualizationSelected);
        }}
      >
        Add visualization
      </AppButton>
    </Box>
  );
};
