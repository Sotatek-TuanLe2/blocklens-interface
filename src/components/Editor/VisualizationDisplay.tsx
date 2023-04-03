import React, { useState } from 'react';
import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { AppButton, AppSelect2 } from '../index';
import TableValue from './TableValue';
import { columnConfigs, queryValueData } from './MockData';
import VisualizationLineChart from './LineChart';
import VisualizationBarChart from './BarChart';

type VisualizationConfigType = {
  value: string;
  label: string;
  type: string;
  // Component: ReactNode;
};

const visualizationConfigs: VisualizationConfigType[] = [
  {
    value: 'query',
    label: 'Query',
    type: 'table',
  },
  {
    label: 'Bar chart',
    type: 'bar',
    value: 'bar',
  },
  {
    label: 'Line chart',
    type: 'line',
    value: 'line',
  },
];

const VisualizationDisplay = () => {
  const [visualizationsActive, setVisualizationsActive] = useState<
    VisualizationConfigType[]
  >([
    {
      value: 'query',
      label: 'Query',
      type: 'table',
    },
  ]);

  const addVisualizationHandler = (visualizationValue: string) => {
    const newVisualization = visualizationConfigs.find(
      (v) => v.value === visualizationValue,
    );
    if (!newVisualization) return;
    setVisualizationsActive([newVisualization, ...visualizationsActive]);
  };

  const renderVisualization = (type: string) => {
    switch (type) {
      case 'table':
        return <TableValue columns={columnConfigs} data={queryValueData} />;
      case 'line':
        return <VisualizationLineChart xAxisKey="time" yAxisKeys={['size']} />;
      case 'bar':
        return (
          <VisualizationBarChart
            data={queryValueData}
            xAxisKey="time"
            yAxisKeys={['size']}
          />
        );
    }
  };

  return (
    <Box>
      <Tabs variant={'enclosed'}>
        <TabList>
          {visualizationsActive.map((tab) => (
            <Tab>{tab.label}</Tab>
          ))}
          <Tab>Add Visualization</Tab>
        </TabList>
        <Box height={'600px'} overflow={'auto'}>
          <TabPanels height={'100%'}>
            {visualizationsActive.map((v) => (
              <TabPanel height={'100%'}>{renderVisualization(v.type)}</TabPanel>
            ))}
            <TabPanel height={'100%'}>
              <AddVisualization onAddVisualize={addVisualizationHandler} />
            </TabPanel>
          </TabPanels>
        </Box>
      </Tabs>
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
      <Text>Select visualization type</Text>
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
