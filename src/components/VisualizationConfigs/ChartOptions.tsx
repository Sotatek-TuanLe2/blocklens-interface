import { useEffect, useMemo, useState } from 'react';
import { TYPE_VISUALIZATION, VisualizationType } from 'src/utils/query.type';
import { CheckboxGroup, Flex, Switch } from '@chakra-ui/react';
import AppInput from '../AppInput';
import { Visualization } from 'src/utils/utils-query';

interface IChartOptions {
  visualization: VisualizationType;
  onChangeConfigurations: (visualization: VisualizationType) => void;
}

const ChartOptions: React.FC<IChartOptions> = ({
  visualization,
  onChangeConfigurations,
}) => {
  const visualizationClass = useMemo(
    () => new Visualization(visualization),
    [visualization],
  );

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
  const chartType = visualizationClass.getType();
  const getStatusDisableStacking =
    chartType !== TYPE_VISUALIZATION.bar &&
    chartType !== TYPE_VISUALIZATION.area;

  useEffect(() => {
    const options = visualizationClass.getConfigs()?.chartOptionsConfigs;

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
        disabled: getStatusDisableStacking,
      },
      // {
      //   label: 'Normalize to percentage',
      //   value: 'percentValues',
      //   checked: options?.percentValues || false,
      //   disabled: getStatusDisablePercentage,
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
      ...visualizationClass.getConfigs()?.chartOptionsConfigs,
      [key]: value,
    };
    onChangeConfigurations({
      ...visualization,
      options: {
        ...visualizationClass.getConfigs(),
        chartOptionsConfigs: newChartOptionsConfigs,
      },
    });
  };

  return (
    <div className={'box-table first-box-table'}>
      <Flex alignItems={'center'} mb={2} className={'box-table-children'}>
        <div className="label-input">Title</div>
        <AppInput
          className={'input-table'}
          value={visualizationClass.getName() || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            changeNameHandle(e.target.value)
          }
          placeholder="My Chart"
          size={'sm'}
        />
      </Flex>
      <CheckboxGroup>
        {chartOptions.map((option) => {
          return (
            <div className="main-toggle " key={option.value}>
              <div
                className={`label-toggle ${
                  option.disabled ? 'label-toggle--disabled' : ''
                }`}
              >
                {option.label}
              </div>
              <Switch
                name={option.value}
                isChecked={option.disabled ? false : option.checked}
                disabled={option.disabled}
                onChange={(e) => {
                  changeValueHandle(option.value, e.target.checked);
                }}
              />
            </div>
          );
        })}
      </CheckboxGroup>
      <p className="divider-bottom" />
    </div>
  );
};

export default ChartOptions;
