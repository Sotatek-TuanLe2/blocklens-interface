import { Checkbox, CheckboxGroup, Switch, Text } from '@chakra-ui/react';
import {
  ChartOptionConfigsType,
  XAxisConfigsType,
  YAxisConfigsType,
} from 'src/utils/query.type';
import AppInput from '../AppInput';

interface IXAxisOptions {
  chartOptions: ChartOptionConfigsType;
  xConfigs: XAxisConfigsType;
  onChangeConfigs: (configs: XAxisConfigsType) => void;
}

export const XAxisOptions: React.FC<IXAxisOptions> = ({
  chartOptions,
  xConfigs,
  onChangeConfigs,
}) => {
  const checkboxConfigs = [
    { label: 'Sort value', value: 'sortX' },
    { label: 'Revert value', value: 'reverseX' },
  ];

  const changeValueHandle = (key: string, value: boolean | string) => {
    const newOptions = {
      ...xConfigs,
      [key]: value,
    };
    onChangeConfigs(newOptions);
  };

  return (
    <div className={'box-table'}>
      <Text
        as={'h3'}
        className={'box-table__title'}
        fontWeight={'bold'}
        mb={'10px'}
      >
        x-axis options
      </Text>
      <div className={'box-table-children'}>
        <Text className="label-input">Axis title</Text>
        <AppInput
          className={'input-table'}
          value={xConfigs?.title || ''}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'title'}
        />
      </div>
      <div className={'box-table-children'}>
        <Text w={'max-content'} pr={2} className="label-input">
          Tick format
        </Text>
        <AppInput
          className={'input-table'}
          size={'sm'}
          placeholder={chartOptions?.percentValues ? '0%' : '0[.]0a'}
          value={xConfigs?.tickFormat || ''}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'tickFormat'}
        />
      </div>
      <CheckboxGroup>
        {checkboxConfigs.map((option) => (
          <div className="main-toggle" key={option.value}>
            <div className="label-toggle"> {option.label}</div>
            <Switch
              key={option.value}
              // @ts-ignore
              isChecked={xConfigs && !!xConfigs[option.value]}
              onChange={(e) =>
                changeValueHandle(option.value, e.target.checked)
              }
            />
          </div>
        ))}
      </CheckboxGroup>
    </div>
  );
};

interface IYAxisOptions {
  chartOptions: ChartOptionConfigsType;
  yConfigs: YAxisConfigsType;
  onChangeConfigs: (configs: YAxisConfigsType) => void;
}

export const YAxisOptions: React.FC<IYAxisOptions> = ({
  chartOptions,
  yConfigs,
  onChangeConfigs,
}) => {
  const changeValueHandle = (key: string, value: boolean | string) => {
    const newOptions = {
      ...yConfigs,
      [key]: value,
    };
    onChangeConfigs(newOptions);
  };

  return (
    <div className={'box-table'}>
      <Text
        as={'h3'}
        className={'box-table__title'}
        fontWeight={'bold'}
        mb={'10px'}
      >
        y-axis options
      </Text>
      <div className={'box-table-children'}>
        <Text className="label-input">Axis title</Text>
        <AppInput
          className={'input-table'}
          value={yConfigs?.title || ''}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'title'}
        />
      </div>

      <div className={'box-table-children'}>
        <Text w={'max-content'} pr={2} className="label-input">
          Tick format
        </Text>
        <AppInput
          className={'input-table'}
          size={'sm'}
          placeholder={chartOptions?.percentValues ? '0%' : '0[.]0a'}
          value={yConfigs?.tickFormat || ''}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'tickFormat'}
        />
      </div>
      <div className={'box-table-children'}>
        <Text w={'max-content'} pr={2} className="label-input">
          Label format
        </Text>
        <AppInput
          className={'input-table'}
          size={'sm'}
          placeholder="0.0"
          value={yConfigs?.labelFormat || ''}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'labelFormat'}
        />
      </div>
      <div className="main-toggle">
        <div className="label-toggle"> Logarithmic</div>
        <Switch
          isChecked={yConfigs?.logarithmic}
          name={'logarithmic'}
          onChange={(e) => changeValueHandle(e.target.name, e.target.checked)}
        />
      </div>
    </div>
  );
};
