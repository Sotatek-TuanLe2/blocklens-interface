import { Box, Flex, Tooltip } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ROUTES } from 'src/utils/common';
import { formatShortText } from 'src/utils/utils-helper';
import { UNSAVED_QUERY } from './Query';

interface IQueryTab {
  id: string;
  name: string;
  isUnsaved?: boolean;
  results?: any[];
}

interface IQueryTabsProps {
  tabs: IQueryTab[];
  activeTab: string;
  onChangeTabs: React.Dispatch<React.SetStateAction<IQueryTab[]>>;
}

const QueryTabs: React.FC<IQueryTabsProps> = (props) => {
  const { tabs, activeTab, onChangeTabs } = props;
  const history = useHistory();

  useEffect(() => {
    const activeTabElement = document.getElementById(activeTab);
    if (activeTabElement) {
      activeTabElement.scrollIntoView(true);
    }
  }, [activeTab, tabs]);

  const navigateQuery = (queryId?: string, isUnsaved = false) => {
    if (queryId) {
      if (isUnsaved) {
        history.push(`${ROUTES.MY_QUERY}?${UNSAVED_QUERY}=${queryId}`);
      } else {
        history.push(`${ROUTES.MY_QUERY}/${queryId}`);
      }
    } else {
      const intialId = new Date().valueOf().toString();
      history.push(`${ROUTES.MY_QUERY}?${UNSAVED_QUERY}=${intialId}`);
    }
  };

  const onClickTab = (id: string, isUnsaved?: boolean) => {
    navigateQuery(id, isUnsaved);
  };

  const onAddTab = () => {
    const intialId = new Date().valueOf().toString();
    history.push(`${ROUTES.MY_QUERY}?${UNSAVED_QUERY}=${intialId}`);
  };

  const onDeleteTab = (e: React.MouseEvent) => (id: string) => {
    e.stopPropagation();
    onChangeTabs((prevState) => prevState.filter((item) => item.id !== id));
    if (activeTab === id) {
      const currentTabIndex = tabs.findIndex((item) => item.id === id);
      const navigatedTab =
        currentTabIndex === 0 ? tabs[1] : tabs[currentTabIndex - 1];
      navigateQuery(navigatedTab.id, navigatedTab.isUnsaved);
    }
  };

  return (
    <Flex className="workspace-page__editor__tabs">
      {tabs.map((tab) => (
        <Flex
          id={tab.id}
          key={tab.id}
          className={`workspace-page__editor__tabs__tab ${
            activeTab === tab.id
              ? 'workspace-page__editor__tabs__tab--active'
              : ''
          }`}
          onClick={() => onClickTab(tab.id, tab.isUnsaved)}
        >
          <Tooltip hasArrow placement="bottom" label={tab.name}>
            <span>
              {tab.name.length > 25
                ? formatShortText(tab.name, 25, 0)
                : tab.name}
            </span>
          </Tooltip>
          {tabs.length > 1 && (
            <Box
              onClick={(e) => onDeleteTab(e)(tab.id)}
              className="bg-CloseBtnIcon"
            />
          )}
        </Flex>
      ))}
      <Box
        mr="20px"
        cursor={'pointer'}
        className="icon-plus-light workspace-page__editor__tabs__tab"
        onClick={onAddTab}
      />
    </Flex>
  );
};

export default QueryTabs;
