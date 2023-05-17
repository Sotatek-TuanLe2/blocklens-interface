import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import ExploreData from './ExploreData';

const Sidebar: React.FC = () => {
  const CATEGORIES = {
    WORK_PLACE: 'WORK_PLACE',
    EXPLORE_DATA: 'EXPLORE_DATA',
  };

  const categoryList: {
    id: string;
    title: string;
    icon: React.ReactNode;
    activeIcon: React.ReactNode;
  }[] = [
    {
      id: CATEGORIES.WORK_PLACE,
      title: 'Work place',
      icon: <></>,
      activeIcon: <></>,
    },
    {
      id: CATEGORIES.EXPLORE_DATA,
      title: 'Explore data',
      icon: <></>,
      activeIcon: <></>,
    },
  ];

  const [category, setCategory] = useState<string>(CATEGORIES.WORK_PLACE);

  const _renderContent = () => {
    switch (category) {
      case CATEGORIES.WORK_PLACE:
        return <></>;
      case CATEGORIES.EXPLORE_DATA:
        // return <ExploreData />; // the old EditorSidebar
        return <></>;
    }
  };

  return (
    <div className="workspace-page__body__sidebar">
      <div className="workspace-page__body__sidebar__categories">
        {categoryList.map((item) => (
          <Box
            key={item.id}
            title={item.title}
            onClick={() => setCategory(item.id)}
          >
            {category === item.id ? item.activeIcon : item.icon}
          </Box>
        ))}
      </div>
      <div className="workspace-page__body__sidebar__content">
        {_renderContent()}
      </div>
    </div>
  );
};

export default Sidebar;
