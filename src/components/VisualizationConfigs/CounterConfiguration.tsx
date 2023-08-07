import { Grid, GridItem, Text } from '@chakra-ui/layout';
import React, { useMemo, useRef, useState } from 'react';
import { VISUALIZATION_DEBOUNCE } from 'src/pages/WorkspacePage/parts/VisualizationDisplay';
import 'src/styles/components/CounterConfigurations.scss';
import { VisualizationType } from 'src/utils/query.type';
import { objectKeys } from 'src/utils/utils-network';
import AppInput from '../AppInput';
import AppSelect2 from '../AppSelect2';
import { Switch } from '@chakra-ui/react';
import { createValidator } from 'src/utils/utils-validator';

interface ICounterConfigurations {
  visualization: VisualizationType;
  onChangeConfigurations: (v: VisualizationType) => void;
  data: unknown[];
}

const CounterConfiguration: React.FC<ICounterConfigurations> = ({
  visualization,
  onChangeConfigurations,
  data,
}) => {
  const [editVisualization, setEditVisualization] =
    useState<VisualizationType>(visualization);
  const MAX_DECIMAL_VALUE = 9;
  const optionsData = editVisualization.options;

  const [counterForm, setCounterForm] = useState<{
    rowNumber: string | number;
    decimals: string | number;
    suffix: string | number;
    prefix: string | number;
  }>({
    rowNumber: optionsData?.rowNumber || '1',
    decimals: optionsData?.stringDecimal || '0',
    suffix: optionsData?.stringSuffix,
    prefix: optionsData?.stringPrefix,
  });

  const validator = useRef(
    createValidator({
      element: (message: string) => <Text color={'red.100'}>{message}</Text>,
    }),
  );

  const axisOptions = useMemo(
    () => (Array.isArray(data) && data[0] ? objectKeys(data[0]) : []),
    [data],
  );

  const axisOptionsConfigs = useMemo(
    () =>
      ['--Select--', ...axisOptions]?.map((axis) => ({
        value: axis as string,
        label: axis as string,
      })),
    [axisOptions],
  );

  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const onChangeDebounce = (visualization: VisualizationType) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      onChangeConfigurations(visualization);
    }, VISUALIZATION_DEBOUNCE);
  };

  const onChangeVisualization = (visualization: VisualizationType) => {
    setEditVisualization(visualization);
    onChangeDebounce(visualization);
  };

  const onChangeCounterName = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeVisualization({
      ...editVisualization,
      name: e.target.value,
    });
  };
  const onChangeCounterConfigurations = (data: any) => {
    onChangeVisualization({
      ...editVisualization,
      options: {
        ...optionsData,
        ...data,
      },
    });
  };

  const onChangeDecimals = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[-e,\.]/g, '');
    setCounterForm((prevState) => ({ ...prevState, decimals: value }));
    if (+value < 0 || +value > MAX_DECIMAL_VALUE) {
      return;
    }
    onChangeCounterConfigurations({
      stringDecimal: value,
    });
  };

  const onChangePrefix = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCounterForm((prevState) => ({ ...prevState, prefix: value }));
    onChangeCounterConfigurations({
      stringPrefix: value.trim(),
    });
  };

  const onChangeSuffix = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCounterForm((prevState) => ({ ...prevState, suffix: value }));
    onChangeCounterConfigurations({
      stringSuffix: value.trim(),
    });
  };

  const onChangeRownumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[-e,\.]/g, '');
    setCounterForm((prevState) => ({ ...prevState, rowNumber: value }));
    onChangeCounterConfigurations({
      rowNumber: value,
    });
  };

  const onKeyDown = (e: { keyCode: number; preventDefault: () => void }) => {
    if (
      e.keyCode === 190 || // dot
      e.keyCode === 188 || // comma
      e.keyCode === 189 || // minus
      e.keyCode === 187 || // plus
      e.keyCode === 107 || // plus numpad
      e.keyCode === 109 || // minus numpad
      e.keyCode === 69 // e
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="config-counter">
      <Grid
        templateColumns={{
          sm: 'repeat(1, 1fr)',
          md: 'repeat(1, 1fr)',
        }}
      >
        <GridItem>
          <div className="box-table first-box-table">
            <Text className="theme-title" fontWeight="bold" marginBottom="10px">
              Counter options
            </Text>
            <div className="box-table-children">
              <div className="label-input">Title</div>
              <AppInput
                value={editVisualization?.name}
                size={'sm'}
                className="input-table"
                placeholder="24h volume"
                onChange={onChangeCounterName}
              />
            </div>
            <div className="box-table-children">
              <div className="label-input">Column</div>
              <AppSelect2
                className="select-table z-100"
                size="medium"
                value={optionsData?.counterColName}
                options={axisOptionsConfigs}
                onChange={(e) =>
                  onChangeCounterConfigurations({ counterColName: e })
                }
              />
            </div>
            <div className="box-table-children">
              <div className="label-input">Row number</div>
              <AppInput
                type="number"
                placeholder="1"
                size={'sm'}
                className="input-table"
                value={counterForm.rowNumber}
                onKeyDown={onKeyDown}
                onChange={onChangeRownumber}
              />
            </div>
            <div className="main-toggle">
              <div className="label-toggle">Colored positive values</div>
              <Switch
                isChecked={optionsData?.coloredPositiveValues}
                value={optionsData?.coloredPositiveValues}
                onChange={(e) =>
                  onChangeCounterConfigurations({
                    coloredPositiveValues: e.target.checked,
                  })
                }
                size="sm"
              />
            </div>
            <div className="main-toggle">
              <div className="label-toggle"> Colored negative values</div>
              <Switch
                isChecked={optionsData?.coloredNegativeValues}
                value={optionsData?.coloredNegativeValues}
                onChange={(e) =>
                  onChangeCounterConfigurations({
                    coloredNegativeValues: e.target.checked,
                  })
                }
                size="sm"
              />
            </div>
            <p className="divider-bottom" />
          </div>
        </GridItem>
        <GridItem>
          <div className="box-table">
            <Text
              className="box-table__title"
              fontWeight="bold"
              marginBottom="10px"
            >
              Formatting
            </Text>
            <div className="box-table-children">
              <div className="label-input">Prefix</div>
              <AppInput
                placeholder="$"
                size={'sm'}
                className="input-table"
                value={counterForm.prefix}
                onChange={onChangePrefix}
              />
            </div>
            <div className="box-table-children">
              <div className="label-input">Suffix</div>
              <AppInput
                placeholder="M"
                size={'sm'}
                className="input-table"
                value={counterForm.suffix}
                onChange={onChangeSuffix}
              />
            </div>
            <div className="box-table-children">
              <div className="label-input">Label</div>
              <AppInput
                placeholder="Current price"
                size={'sm'}
                className="input-table"
                value={optionsData?.counterLabel}
                onChange={(e) =>
                  onChangeCounterConfigurations({
                    counterLabel: e.target.value,
                  })
                }
              />
            </div>
            <div className="box-table-children">
              <div className="label-input">Decimals</div>
              <AppInput
                type="number"
                placeholder="1"
                size={'sm'}
                className="input-table"
                value={counterForm.decimals}
                onKeyDown={onKeyDown}
                onChange={onChangeDecimals}
                validate={{
                  name: `decimals`,
                  validator: validator.current,
                  rule: ['isDecimnals'],
                }}
              />
            </div>
          </div>
        </GridItem>
      </Grid>
    </div>
  );
};

export default CounterConfiguration;
