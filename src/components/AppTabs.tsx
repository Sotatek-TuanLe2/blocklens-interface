import {
  Box,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { CloseMenuIcon } from 'src/assets/icons';
import 'src/styles/components/AppTabs.scss';

interface IAppTabs {
  defaultTab?: number;
  tabs: ITabs[];
  onChange?: (value: string) => void;
  rightElement?: () => ReactNode;
  onCloseTab?: (id: string) => void;
}
export interface ITabs {
  name: string;
  content: ReactNode;
  id: string;
  icon?: ReactNode;
  closeable?: boolean;
}

const AppTabs: FC<IAppTabs> = ({
  defaultTab = 0,
  tabs,
  onChange,
  rightElement,
  onCloseTab,
}) => {
  return (
    <Tabs
      h={'full'}
      display="flex"
      flexDirection={'column'}
      variant={'unstyled'}
      colorScheme="transparent"
      defaultIndex={defaultTab}
      className="app-tab"
      isLazy
    >
      <TabList className="tab-list">
        <Flex justifyContent={'space-between'} alignItems="center" w="100%">
          <Flex alignItems="center">
            {tabs.map((tab: ITabs) => {
              return (
                <Tab
                  key={tab.id}
                  className="app-tab__name-tab"
                  onClick={() => onChange && onChange(tab.id)}
                >
                  <span>
                    {tab.icon && <span>{tab.icon}</span>}
                    <span>{tab.name}</span>
                  </span>
                  {tab.closeable && (
                    <Box
                      as={'span'}
                      ml={2}
                      cursor={'pointer'}
                      onClick={() => {
                        if (!onCloseTab) return;
                        onCloseTab(tab.id);
                      }}
                    >
                      <CloseMenuIcon width={14} />
                    </Box>
                  )}
                </Tab>
              );
            })}
          </Flex>
          <Box>{rightElement ? rightElement() : ''}</Box>
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
