import { Box, Flex, Skeleton } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { Layout, Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import ReactMarkdown from 'react-markdown';
import 'react-resizable/css/styles.css';
import { useParams } from 'react-router-dom';
import VisualizationItem from 'src/pages/WorkspacePage/parts/VisualizationItem';
import rf from 'src/requests/RequestFactory';
import 'src/styles/components/AppQueryMenu.scss';
import 'src/styles/components/Chart.scss';
import 'src/styles/components/TableValue.scss';
import 'src/styles/pages/DashboardDetailPage.scss';
import { IVisualizationWidget } from 'src/utils/query.type';
import { getErrorMessage } from 'src/utils/utils-helper';
import { toastError } from 'src/utils/utils-notify';

interface ILayout extends Layout {
  id: string;
  text?: string;
  type: string;
  content: any;
}

const WIDGET_TYPE = {
  VISUALIZATION: 'visualization',
  TEXT: 'text',
};

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardScreenShot: React.FC = () => {
  const { dashboardId } = useParams<{ dashboardId: string }>();

  const [dataLayout, setDataLayout] = useState<ILayout[]>([]);
  const [isEmptyDashboard, setIsEmptyDashboard] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const generateVisualizationItem = (
    item: IVisualizationWidget,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => ({
    x: x,
    y: y,
    w: width,
    h: height,
    i: item.id,
    id: item.id,
    type: WIDGET_TYPE.VISUALIZATION,
    content: item.visualization,
  });

  const getTheFirstFourVisualizations = (
    result: any[] = [],
    inputVisualizations: any[],
  ): any[] => {
    if (result.length === 4 || !inputVisualizations.length) {
      return result;
    }

    let [item] = inputVisualizations;
    inputVisualizations.forEach((visual) => {
      if (
        visual.options.sizeY < item.options.sizeY ||
        (visual.options.sizeY === item.options.sizeY &&
          visual.options.sizeX < item.options.sizeX)
      ) {
        item = visual;
      }
    });

    result.push(item);
    return getTheFirstFourVisualizations(
      result,
      inputVisualizations.filter((visual) => visual.id !== item.id),
    );
  };

  const fetchLayoutData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await rf
        .getRequest('DashboardsRequest')
        .getPublicDashboardById(dashboardId);

      if (!res || !res.dashboardVisuals.length) {
        setIsEmptyDashboard(true);
        return;
      }

      const theFirstFourVisualizations = getTheFirstFourVisualizations(
        [],
        res.dashboardVisuals,
      );
      let layouts: ILayout[] = [];

      if (theFirstFourVisualizations.length <= 2) {
        const [one] = theFirstFourVisualizations;
        layouts = [generateVisualizationItem(one, 0, 0, 12, 6)];
      } else if (theFirstFourVisualizations.length === 3) {
        const [one, two, three] = theFirstFourVisualizations;
        layouts = [
          generateVisualizationItem(one, 0, 0, 6, 3),
          generateVisualizationItem(two, 6, 0, 6, 3),
          generateVisualizationItem(three, 0, 3, 12, 3),
        ];
      } else {
        const [one, two, three, four] = theFirstFourVisualizations;
        layouts = [
          generateVisualizationItem(one, 0, 0, 6, 3),
          generateVisualizationItem(two, 6, 0, 6, 3),
          generateVisualizationItem(three, 0, 3, 6, 3),
          generateVisualizationItem(four, 6, 3, 6, 3),
        ];
      }

      setDataLayout(layouts);
      setIsEmptyDashboard(false);
    } catch (error) {
      toastError({ message: getErrorMessage(error) });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [dashboardId]);

  useEffect(() => {
    if (dashboardId) {
      fetchLayoutData();
    }
  }, [dashboardId]);

  const _renderEmptyDashboardScreenShot = () => (
    <Flex
      justifyContent={'center'}
      alignItems={'center'}
      height={'90vh'}
      bg="rgba(0, 0, 0, 0)"
    >
      <img src="/images/logo.svg" alt="logo" width={'50%'} />
    </Flex>
  );

  const _renderDashboardScreenShot = () => {
    if (isEmptyDashboard) {
      return _renderEmptyDashboardScreenShot();
    }

    return (
      <>
        {dataLayout && (
          <ResponsiveGridLayout
            className="main-grid-layout"
            layouts={{ lg: dataLayout }}
            isDraggable={false}
            isResizable={false}
            measureBeforeMount
            containerPadding={[0, 0]}
            margin={[20, 20]}
          >
            {dataLayout.map((item: ILayout) => (
              <div className="box-layout" key={item.id}>
                <div className="box-chart">
                  {item.type === WIDGET_TYPE.VISUALIZATION ? (
                    <VisualizationItem
                      visualization={item.content}
                      needAuthentication={false}
                    />
                  ) : (
                    <div className="box-text-widget">
                      <ReactMarkdown>{item.text || ''}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </ResponsiveGridLayout>
        )}
      </>
    );
  };

  return (
    <div className="workspace-page__editor">
      {isLoading ? (
        <Box
          p={'10px'}
          w={'full'}
          maxW={'100%'}
          style={{ aspectRatio: '1396 / 660' }}
        >
          <Box
            bg={'white'}
            rounded={'10px'}
            boxShadow={'0px 15px 30px rgba(0, 0, 0, 0.04)'}
            w={'full'}
            h={'full'}
            px={'24px'}
            py={'22px'}
          >
            <Flex align={'center'}>
              <Skeleton w={'130px'} h={'18px'} rounded={'9px'} mr={'10px'} />
              <Skeleton w={'130px'} h={'18px'} rounded={'9px'} />
            </Flex>
          </Box>
        </Box>
      ) : (
        <Box mt="0" className="dashboard-container">
          {_renderDashboardScreenShot()}
        </Box>
      )}
    </div>
  );
};

export default DashboardScreenShot;
