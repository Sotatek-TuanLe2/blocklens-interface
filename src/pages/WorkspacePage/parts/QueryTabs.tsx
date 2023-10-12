import { Box, Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ROUTES } from 'src/utils/common';
import { IQuery } from 'src/utils/query.type';

interface IQueryTab {
  id: string;
  name: string;
  isUnsaved?: boolean;
}

interface IQueryTabsProps {
  queryValue: IQuery | null;
}

const UNSAVED_QUERY = 'unsaved_query';
const UNSAVED_QUERY_TITLE = 'Unsaved query';

const QueryTabs: React.FC<IQueryTabsProps> = (props) => {
  const { queryValue } = props;
  const history = useHistory();
  const { search: searchUrl } = useLocation();
  const { queryId } = useParams<{ queryId: string }>();

  const [tabs, setTabs] = useState<IQueryTab[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');

  const searchParams = new URLSearchParams(searchUrl);

  useEffect(() => {
    const unsavedQueryId = searchParams.get(UNSAVED_QUERY);

    if (unsavedQueryId) {
      setActiveTab(unsavedQueryId);
      if (!tabs.some((item) => item.id === unsavedQueryId)) {
        setTabs((prevState) => [
          ...prevState,
          { id: unsavedQueryId, name: UNSAVED_QUERY_TITLE, isUnsaved: true },
        ]);
      }
    }
  }, [searchUrl]);

  useEffect(() => {
    // initiate query tabs
    if (queryId) {
      setActiveTab(queryId);
      if (!tabs.some((item) => item.id === queryId)) {
        setTabs((prevState) => [
          ...prevState,
          { id: queryId, name: 'Loading...' },
        ]);
      }
    } else {
      const unsavedQueryId = searchParams.get(UNSAVED_QUERY);
      if (!unsavedQueryId) {
        const intialId = new Date().valueOf().toString();
        setTabs((prevState) => [
          ...prevState,
          { id: intialId, name: UNSAVED_QUERY_TITLE, isUnsaved: true },
        ]);
        setActiveTab(intialId);
      }
    }
  }, [queryId]);

  useEffect(() => {
    if (queryValue) {
      // Update query's name after fetching from BE API
      setTabs((prevState) => {
        const newTabs = [...prevState];
        const currentTabIndex = newTabs.findIndex(
          (item) => item.id === queryValue.id,
        );
        if (currentTabIndex > -1) {
          newTabs[currentTabIndex].name = queryValue.name;
        } else {
          newTabs.push({ id: queryValue.id, name: queryValue.name });
        }
        return newTabs;
      });
    }
  }, [queryValue]);

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

  const onDeleteTab = (e: React.MouseEvent) => (id: string) => {
    e.stopPropagation();
    setTabs((prevState) => prevState.filter((item) => item.id !== id));
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
          key={tab.id}
          className={`workspace-page__editor__tabs__tab ${
            activeTab === tab.id
              ? 'workspace-page__editor__tabs__tab--active'
              : ''
          }`}
          onClick={() => onClickTab(tab.id, tab.isUnsaved)}
        >
          <span>{tab.name}</span>
          {tabs.length > 1 && (
            <Box
              onClick={(e) => onDeleteTab(e)(tab.id)}
              className="bg-CloseBtnIcon"
            />
          )}
        </Flex>
      ))}
      <Box
        cursor={'pointer'}
        className="icon-plus-light"
        onClick={() => navigateQuery()}
      />
    </Flex>
  );
};

export default QueryTabs;
