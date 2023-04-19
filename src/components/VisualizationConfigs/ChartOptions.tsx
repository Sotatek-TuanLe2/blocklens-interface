import { useEffect, useState } from 'react';
import { VisualizationType } from 'src/utils/query.type';
import { Checkbox, CheckboxGroup, Flex, Text } from '@chakra-ui/react';
import AppInput from '../AppInput';

interface IChartOptions {
  visualization: VisualizationType;
  onChangeConfigurations: (visualization: VisualizationType) => void;
}

const ChartOptions: React.FC<IChartOptions> = ({
  visualization,
  onChangeConfigurations,
}) => {
  const [chartOptions, setChartOptions] = useState([
    {
      label: 'Show chart legend',
      value: 'showLegend',
      checked: true,
      disabled: false,
    },
    {
      label: 'Enable stacking',
      value: 'stacking',
      checked: false,
      disabled: false,
    },
    // {
    //   label: 'Normalize to percentage',
    //   value: 'percentValues',
    //   checked: false,
    //   disabled: false,
    // },
    {
      label: 'Show data labels',
      value: 'showDataLabels',
      checked: false,
      disabled: false,
    },
  ]);

  useEffect(() => {
    const options = visualization.options.chartOptionsConfigs;

    setChartOptions([
      {
        label: 'Show chart legend',
        value: 'showLegend',
        checked: options?.showLegend || false,
        disabled: false,
      },
      {
        label: 'Enable stacking',
        value: 'stacking',
        checked: options?.stacking || false,
        disabled: false,
      },
      // {
      //   label: 'Normalize to percentage',
      //   value: 'percentValues',
      //   checked: options?.percentValues || false,
      //   disabled: false,
      // },
      {
        label: 'Show data labels',
        value: 'showDataLabels',
        checked: options?.showDataLabels || false,
        disabled: !!options?.stacking,
      },
    ]);
  }, [visualization]);

  const changeNameHandle = (value: string) => {
    onChangeConfigurations({
      ...visualization,
      name: value,
    });
  };

  const changeValueHandle = (key: string, value: boolean | string) => {
    const newChartOptionsConfigs = {
      ...visualization.options.chartOptionsConfigs,
      [key]: value,
    };
    onChangeConfigurations({
      ...visualization,
      options: {
        ...visualization.options,
        chartOptionsConfigs: newChartOptionsConfigs,
      },
    });
  };

  return (
    <div className={'box-table'}>
      <Text
        as={'h3'}
        className={'box-table__title'}
        fontWeight={'bold'}
        mb={'10px'}
      >
        Chart options
      </Text>
      <Flex alignItems={'center'} mb={2} className={'box-table-children'}>
        <div>Title</div>
        <AppInput
          className={'input-table'}
          value={visualization?.name || ''}
          onChange={(e: any) => changeNameHandle(e.target.value)}
          size={'sm'}
        />
      </Flex>
      <CheckboxGroup>
        {chartOptions.map((option) => {
          return (
            <div className={'main-checkbox'} key={option.value}>
              <Checkbox
                key={option.value}
                name={option.value}
                isChecked={option.disabled ? false : option.checked}
                disabled={option.disabled}
                onChange={(e) => {
                  changeValueHandle(option.value, e.target.checked);
                }}
              >
                {option.label}
              </Checkbox>
            </div>
          );
        })}
      </CheckboxGroup>
    </div>
  );
};

export default ChartOptions;
