import { Checkbox } from '@chakra-ui/checkbox';
import { Grid, GridItem, Text } from '@chakra-ui/layout';
import React, { useMemo, useRef, useState } from 'react';
import { VISUALIZATION_DEBOUNCE } from 'src/pages/WorkspacePage/parts/VisualizationDisplay';
import 'src/styles/components/CounterConfigurations.scss';
import { VisualizationType } from 'src/utils/query.type';
import { objectKeys } from 'src/utils/utils-network';
import AppInput from '../AppInput';
import AppSelect2 from '../AppSelect2';

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

  const timeout = useRef() as any;

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

  const onChangeCounterName = (e: any) => {
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

  const onKeyDown = (e: { keyCode: number; preventDefault: () => void }) => {
    if (
      e.keyCode === 189 ||
      e.keyCode === 187 ||
      e.keyCode === 107 ||
      e.keyCode === 109 ||
      e.keyCode === 69
    ) {
      e.preventDefault();
    }
  };

  return (
    <div className="config-counter">
      {/* <header>
        <AppButton className="btn-add" size="sm">
          Add to dashboard
        </AppButton>
      </header> */}
      <Grid
        templateColumns={{
          sm: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
        gap={'10px'}
      >
        <GridItem>
          <div className="box-table">
            <Text
              className="box-table__title"
              fontWeight="bold"
              marginBottom="10px"
            >
              Counter options
            </Text>
            <div className="box-table-children">
              <div>Title</div>
              <AppInput
                value={editVisualization?.name}
                size={'sm'}
                className="input-table"
                placeholder="24h volume"
                onChange={onChangeCounterName}
              />
            </div>
            <div className="box-table-children">
              <div>Column</div>
              <AppSelect2
                className="select-table z-100"
                size="small"
                value={dataColumn?.counterColName}
                options={axisOptionsConfigs}
                onChange={(e) =>
                  onChangeCounterConfigurations({ counterColName: e })
                }
              />
            </div>
            <div className="box-table-children">
              <div>Row number</div>
              <AppInput
                type="number"
                placeholder="Price"
                size={'sm'}
                className="input-table"
                value={dataColumn?.rowNumber || 1}
                onChange={(e) =>
                  onChangeCounterConfigurations({
                    rowNumber: e.target.value || 1,
                  })
                }
              />
            </div>
            <div className="main-checkbox">
              <Checkbox
                isChecked={dataColumn?.coloredPositiveValues}
                value={dataColumn?.coloredPositiveValues}
                onChange={(e) =>
                  onChangeCounterConfigurations({
                    coloredPositiveValues: e.target.checked,
                  })
                }
                size="sm"
              >
                Colored positive values
              </Checkbox>
            </div>
            <div className="main-checkbox">
              <Checkbox
                isChecked={dataColumn?.coloredNegativeValues}
                value={dataColumn?.coloredNegativeValues}
                onChange={(e) =>
                  onChangeCounterConfigurations({
                    coloredNegativeValues: e.target.checked,
                  })
                }
                size="sm"
              >
                Colored negative values
              </Checkbox>
            </div>
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
              <div>Prefix</div>
              <AppInput
                placeholder="$"
                size={'sm'}
                className="input-table"
                value={dataColumn?.stringPrefix}
                onChange={(e) =>
                  onChangeCounterConfigurations({
                    stringPrefix: e.target.value,
                  })
                }
              />
            </div>
            <div className="box-table-children">
              <div>Suffix</div>
              <AppInput
                placeholder="M"
                size={'sm'}
                className="input-table"
                value={dataColumn?.stringSuffix}
                onChange={(e) =>
                  onChangeCounterConfigurations({
                    stringSuffix: e.target.value,
                  })
                }
              />
            </div>
            <div className="box-table-children">
              <div>Label</div>
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
              <div>Decimals</div>
              <AppInput
                type="number"
                placeholder="1"
                size={'sm'}
                className="input-table"
                value={dataColumn?.stringDecimal}
                onKeyDown={onKeyDown}
                onChange={(e) => {
                  const value = e?.target?.value.replace(/[-e]/gi, '');
                  if (value.length > 1) return;
                  onChangeCounterConfigurations({
                    stringDecimal: value,
                  });
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
