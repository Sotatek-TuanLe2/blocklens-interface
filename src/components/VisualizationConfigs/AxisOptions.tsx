import { Checkbox, CheckboxGroup, Text } from '@chakra-ui/react';
import { XAxisConfigsType, YAxisConfigsType } from 'src/utils/query.type';
import AppInput from '../AppInput';

interface IXAxisOptions {
  xConfigs: XAxisConfigsType;
  onChangeConfigs: (configs: XAxisConfigsType) => void;
}

export const XAxisOptions: React.FC<IXAxisOptions> = ({
  xConfigs,
  onChangeConfigs,
}) => {
  const checkboxConfigs = [
    { label: 'Sort value', value: 'sortX' },
    { label: 'Revert value', value: 'reverseX' },
  ];

  const changeValueHandle = (key: string, value: boolean | string) => {
    let tempOptions = xConfigs;
    tempOptions = {
      ...tempOptions,
      [key]: value,
    };
    onChangeConfigs(tempOptions);
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
        <Text>Axis title</Text>
        <AppInput
          className={'input-table'}
          value={xConfigs?.title || ''}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'title'}
        />
      </div>
      <CheckboxGroup>
        {checkboxConfigs.map((option) => (
          <div className={'main-checkbox'}>
            <Checkbox
              key={option.value}
              value={option.value}
              onChange={(e) =>
                changeValueHandle(option.value, e.target.checked)
              }
            >
              {option.label}
            </Checkbox>
          </div>
        ))}
      </CheckboxGroup>
    </div>
  );
};

interface IYAxisOptions {
  yConfigs: YAxisConfigsType;
  onChangeConfigs: (configs: YAxisConfigsType) => void;
}

export const YAxisOptions: React.FC<IYAxisOptions> = ({
  yConfigs,
  onChangeConfigs,
}) => {
  const changeValueHandle = (key: string, value: boolean | string) => {
    let tempOptions = yConfigs;
    tempOptions = {
      ...tempOptions,
      [key]: value,
    };
    onChangeConfigs(tempOptions);
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
        <Text>Axis title</Text>
        <AppInput
          className={'input-table'}
          value={yConfigs?.title || ''}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'title'}
        />
      </div>
      <div className={'main-checkbox'}>
        <Checkbox
          value={'logarithmic'}
          name={'logarithmic'}
          onChange={(e) => changeValueHandle(e.target.name, e.target.checked)}
        >
          {'Logarithmic'}
        </Checkbox>
      </div>
      <div className={'box-table-children'}>
        <Text w={'max-content'} pr={2}>
          Tick format
        </Text>
        <AppInput
          className={'input-table'}
          size={'sm'}
          value={yConfigs?.tickFormat || ''}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'tickFormat'}
        />
      </div>
      <div className={'box-table-children'}>
        <Text w={'max-content'} pr={2}>
          Label format
        </Text>
        <AppInput
          className={'input-table'}
          size={'sm'}
          value={yConfigs?.labelFormat || ''}
          onChange={(e) => changeValueHandle(e.target.name, e.target.value)}
          name={'labelFormat'}
        />
      </div>
    </div>
  );
};
