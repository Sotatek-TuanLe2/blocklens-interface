import React, { useEffect, useMemo, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import TableSqlValue from '../../../components/Chart/TableSqlValue';
import VisualizationBarChart from '../../../components/Chart/BarChart';
import { AppButton, AppSelect2 } from '../../../components';
import VisualizationAreaChart from '../../../components/Chart/AreaChart';
import AppTabs from '../../../components/AppTabs';
import { objectKeys } from '../../../utils/utils-network';
import VisualizationLineChart from '../../../components/Chart/LineChart';
import ChartSettings from '../../../components/SqlEditor/ChartSettings';
import VisualizationPieChart from '../../../components/Chart/PieChart';
import { QueryType, VisualizationType } from '../../../utils/common';
import DashboardsRequest from '../../../requests/DashboardsRequest';
import { useParams } from 'react-router-dom';

type VisualizationConfigType = {
  value: string;
  label: string;
  type: string;
};

const visualizationConfigs: VisualizationConfigType[] = [
  {
    value: 'query',
    label: 'Query',
    type: 'table',
  },
  {
    label: 'Bar chart',
    type: 'column',
    value: 'bar',
  },
  {
    label: 'Line chart',
    type: 'line',
    value: 'line',
  },
  {
    label: 'Area chart',
    type: 'area',
    value: 'area',
  },
  {
    label: 'Pie chart',
    type: 'pie',
    value: 'pie',
  },
];

type Props = {
  queryValues: unknown[];
  queryInfo: QueryType;
};

const VisualizationDisplay = ({ queryValues, queryInfo }: Props) => {
  const { queryId } = useParams<{ queryId: string }>();
  console.log(queryInfo);

  const [visualizationsActive, setVisualizationsActive] = useState<
    VisualizationType[]
  >([{ id: '1', options: {}, name: 'New Visualization', type: '' }]);

  const columns =
    Array.isArray(queryValues) && queryValues[0]
      ? objectKeys(queryValues[0])
      : [];
  const tableValuesColumnConfigs = useMemo(
    () =>
      columns.map((col) => ({
        id: col,
        accessorKey: col,
        header: col,
        enableResizing: true,
        size: 100,
      })),
    [queryValues],
  );

  const addVisualizationToQuery = async (
    queryId: string,
    updateQuery: Partial<QueryType>,
  ) => {
    const request = new DashboardsRequest();
    await request.updateQuery(queryId, updateQuery);
  };

  // const getQuery = async (queryId: string) => {
  //   const request = new DashboardsRequest();
  //   return await request.getQuery(queryId);
  // };

  const addVisualizationHandler = async (visualizationValue: string) => {
    console.log('visualizationValue', visualizationValue);
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
        id: '1',
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

    setVisualizationsActive((prevState) => {
      const [queryResult, ...others] = prevState;

      return [queryResult, newVisualization, ...others];
    });
    const updateQuery = {
      ...queryInfo,
      visualizations: [...queryInfo.visualizations, newVisualization],
    };
    await addVisualizationToQuery(queryId, updateQuery);
  };

  useEffect(() => {
    setVisualizationsActive((prevState) => [
      ...queryInfo.visualizations,
      { id: '1', options: {}, name: 'New Visualization', type: '' },
    ]);
  }, []);

  const renderVisualization = (type: string) => {
    switch (type) {
      case 'table':
        return (
          <TableSqlValue
            columns={tableValuesColumnConfigs as typeof queryValues}
            data={queryValues}
          />
        );
      case 'line':
        return (
          <VisualizationLineChart
            data={queryValues}
            xAxisKey="time"
            yAxisKeys={['size']}
          />
        );
      case 'column':
        return (
          <VisualizationBarChart
            data={queryValues}
            xAxisKey="time"
            yAxisKeys={['size']}
          />
        );
      case 'area':
        return (
          <VisualizationAreaChart
            data={queryValues}
            xAxisKey="time"
            yAxisKeys={['size']}
          />
        );
      case 'pie':
        return <VisualizationPieChart data={queryValues} dataKey={'number'} />;
      default:
        return <AddVisualization onAddVisualize={addVisualizationHandler} />;
    }
  };

  return (
    <Box height={'500px'} overflow={'auto'}>
      <AppTabs
        tabs={visualizationsActive.map((v, index) => ({
          name: v.name,
          content: renderVisualization(v.options.globalSeriesType || v.type),
          id: index.toString(),
        }))}
      />
      <ChartSettings />
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
