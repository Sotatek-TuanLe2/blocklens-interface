import { Grid, GridItem, Text } from '@chakra-ui/layout';
import React, { useMemo, useRef, useState } from 'react';
import { VISUALIZATION_DEBOUNCE } from 'src/pages/WorkspacePage/parts/VisualizationDisplay';
import 'src/styles/components/CounterConfigurations.scss';
import { VisualizationType } from 'src/utils/query.type';
import { objectKeys } from 'src/utils/utils-network';
import AppInput from '../AppInput';
import AppSelect2 from '../AppSelect2';
import { Switch } from '@chakra-ui/react';

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

  const axisOptions = useMemo(
    () => (Array.isArray(data) && data[0] ? objectKeys(data[0]) : []),
    [data],
  );

  const axisOptionsConfigs = useMemo(
    () =>
      ['', ...axisOptions]?.map((axis) => ({
        value: axis as string,
        label: axis as string,
      })),
    [axisOptions],
  );

  const dataColumn = editVisualization.options;

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
        ...editVisualization.options,
        ...data,
      },
    });
  };

  const onChangeStringDecimal = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[-e]/gi, '');
    if (+value <= 0) {
      value = '0';
    } else if (+value >= MAX_DECIMAL_VALUE) {
      value = String(MAX_DECIMAL_VALUE);
    }
    onChangeCounterConfigurations({
      stringDecimal: value,
    });
  };

  const onKeyDown = (e: { keyCode: number; preventDefault: () => void }) => {
    if (
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
                value={dataColumn?.counterColName}
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
                placeholder="Price"
                size={'sm'}
                className="input-table"
                value={dataColumn?.rowNumber || 1}
                onChange={(e) =>
                  onChangeCounterConfigurations({
                    rowNumber: e.target.value || '1',
                  })
                }
              />
            </div>
            <div className="main-toggle">
              <div className="label-toggle">Colored positive values</div>
              <Switch
                isChecked={dataColumn?.coloredPositiveValues}
                value={dataColumn?.coloredPositiveValues}
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
                isChecked={dataColumn?.coloredNegativeValues}
                value={dataColumn?.coloredNegativeValues}
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
                value={dataColumn?.stringPrefix}
                onChange={(e) =>
                  onChangeCounterConfigurations({
                    stringPrefix: e.target.value.trim(),
                  })
                }
              />
            </div>
            <div className="box-table-children">
              <div className="label-input">Suffix</div>
              <AppInput
                placeholder="M"
                size={'sm'}
                className="input-table"
                value={dataColumn?.stringSuffix}
                onChange={(e) =>
                  onChangeCounterConfigurations({
                    stringSuffix: e.target.value.trim(),
                  })
                }
              />
            </div>
            <div className="box-table-children">
              <div className="label-input">Label</div>
              <AppInput
                placeholder="Current price"
                size={'sm'}
                className="input-table"
                value={dataColumn?.counterLabel}
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
                value={
                  dataColumn?.stringDecimal
                    ? parseInt(dataColumn?.stringDecimal, 10)?.toString()
                    : '0'
                }
                onKeyDown={onKeyDown}
                onChange={onChangeStringDecimal}
              />
            </div>
          </div>
        </GridItem>
      </Grid>
    </div>
  );
};

export default CounterConfiguration;
