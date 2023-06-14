import {
  Box,
  Flex,
  FlexProps,
  Tab,
  TabList,
  TabListProps,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import 'src/styles/components/AppTabs.scss';
import { CloseIcon } from '@chakra-ui/icons';

interface IAppTabs {
  defaultTabIndex?: number;
  currentTabIndex?: number;
  tabs: ITabs[];
  onChange?: (tabId: string, tabIndex: number) => void;
  rightElement?: ReactNode;
  onCloseTab?: (id: string) => void;
  sxTabList?: TabListProps;
  sxTabsHeader?: FlexProps;
}
export interface ITabs {
  name: string | JSX.Element;
  content: ReactNode;
  id: string;
  icon?: ReactNode;
  closeable?: boolean;
  onTabClick?: () => void;
}

const AppTabs: FC<IAppTabs> = ({
  defaultTabIndex = 0,
  currentTabIndex,
  tabs,
  onChange,
  rightElement,
  onCloseTab,
  sxTabList,
  sxTabsHeader,
}) => {
  return (
    <Tabs
      h={'full'}
      display="flex"
      flexDirection={'column'}
      variant={'unstyled'}
      colorScheme="transparent"
      defaultIndex={defaultTabIndex}
      index={currentTabIndex}
      className="app-tab"
      isLazy
    >
      <TabList className="tab-list" {...sxTabList}>
        <Flex
          justifyContent={'space-between'}
          alignItems="center"
          className="tabs-header"
          w="100%"
          {...sxTabsHeader}
        >
          <Flex
            alignItems="center"
            overflow={'auto'}
            className="tabs-container"
          >
            {tabs.map((tab: ITabs, index: number) => {
              return (
                <Tab
                  key={tab.id}
                  className="app-tab__name-tab"
                  onClick={() => onChange && onChange(tab.id, index)}
                >
                  <Flex
                    justifyContent={'center'}
                    alignItems={'center'}
                    className="app-tab__name-tab__detail"
                  >
                    {tab.icon && <span>{tab.icon}</span>}
                    <Box
                      as="span"
                      className="tab-name-content"
                      whiteSpace={'nowrap'}
                    >
                      {tab.name}
                    </Box>
                  </Flex>
                  {tab.closeable && (
                    <CloseIcon
                      boxSize={2}
                      ml={2}
                      cursor={'pointer'}
                      onClick={() => {
                        if (!onCloseTab) return;
                        onCloseTab(tab.id);
                      }}
                    />
                  )}
                </Tab>
              );
            })}
          </Flex>
          <Box>{rightElement || ''}</Box>
        </Flex>
      </TabList>

      <TabPanels flex={1}>
        {tabs.map((tab: ITabs) => {
          return (
            <TabPanel key={tab.id} h={'full'} className="app-tab__content-tab">
              {tab.content}
            </TabPanel>
          );
        })}
      </TabPanels>
    </Tabs>
  );
};

export default AppTabs;
