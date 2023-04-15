import { useEffect, useState } from 'react';
import { ChartOptionConfigsType } from 'src/utils/query.type';
import { Checkbox, CheckboxGroup, Flex, Text } from '@chakra-ui/react';
import AppInput from '../AppInput';

interface IChartOptions {
  options: Partial<ChartOptionConfigsType>;
  onChangeOptions: (options: Partial<ChartOptionConfigsType>) => void;
}

const ChartOptions: React.FC<IChartOptions> = ({
  options,
  onChangeOptions,
}) => {
  const [chartOptions, setChartOptions] = useState([
    {
      label: 'Show chart legend',
      value: 'showLegend',
      checked: true,
    },
    { label: 'Enable stacking', value: 'stacking', checked: false },
    {
      label: 'Normalize to percentage',
      value: 'percentValues',
      checked: false,
    },
  ]);

  useEffect(() => {
    setChartOptions([
      {
        label: 'Show chart legend',
        value: 'showLegend',
        checked: options?.showLegend || false,
      },
      {
        label: 'Enable stacking',
        value: 'stacking',
        checked: options?.stacking || false,
      },
      {
        label: 'Normalize to percentage',
        value: 'percentValues',
        checked: options?.percentValues || false,
      },
    ]);
  }, [options]);

  const changeValueHandle = (key: string, value: boolean | string) => {
    let tempOptions = options;
    tempOptions = {
      ...tempOptions,
      [key]: value,
    };
    onChangeOptions(tempOptions);
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
          value={options?.name || ''}
          onChange={(e) => changeValueHandle('name', e.target.value)}
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
                isChecked={option.checked}
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
