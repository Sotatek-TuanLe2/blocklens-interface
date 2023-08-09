import moment from 'moment';
import { AppGridItem, AppRowItem } from 'src/components';
import AppQueryMenu, { QUERY_MENU_LIST } from 'src/components/AppQueryMenu';
import { DisplayType } from 'src/constants';
import { ROUTES } from 'src/utils/common';
import { IDashboardDetail, IQuery } from 'src/utils/query.type';
import { Dashboard } from 'src/utils/utils-dashboard';
import { Query } from 'src/utils/utils-query';
import { LIST_ITEM_TYPE, ITEM_TYPE } from '..';
import { Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { formatNumber } from 'src/utils/utils-format';
import { generatePositiveRandomNumber } from 'src/utils/utils-helper';
import useUser from 'src/hooks/useUser';

interface IListItem {
  isLoading?: boolean;
  type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  itemType: typeof ITEM_TYPE[keyof typeof ITEM_TYPE];
  item?: IDashboardDetail | IQuery;
  displayed?: string;
  isSaved?: boolean;
}

const ListItem: React.FC<IListItem> = (props) => {
  const { type, itemType, item, displayed, isSaved = false, isLoading } = props;
  const { user } = useUser();

  const randomViews = useMemo(
    () => formatNumber(generatePositiveRandomNumber(1000), 2),
    [item?.id],
  );

  if (isLoading) {
    return displayed === DisplayType.Grid ? (
      <AppGridItem isLoading />
    ) : (
      <AppRowItem isLoading type={type} itemType={itemType} />
    );
  }

  const itemClass =
    type === LIST_ITEM_TYPE.DASHBOARDS
      ? new Dashboard(item as IDashboardDetail)
      : new Query(item as IQuery);
  const userName = `${itemClass.getUserFirstName()} ${itemClass.getUserLastName()}`;

  const getTitleUrl = (): string => {
    switch (type) {
      case LIST_ITEM_TYPE.DASHBOARDS:
        return `${ROUTES.DASHBOARD}/${itemClass.getId()}/`;
      case LIST_ITEM_TYPE.QUERIES:
        return `${ROUTES.QUERY}/${itemClass.getId()}`;
      case LIST_ITEM_TYPE.MYWORK:
        if (itemType === ITEM_TYPE.DASHBOARDS) {
          return `${ROUTES.MY_DASHBOARD}/${itemClass.getId()}`;
        }
        return `${ROUTES.MY_QUERY}/${itemClass.getId()}`;
      case LIST_ITEM_TYPE.SAVED:
        const isUserOwner = itemClass.getUserId() === user?.getId();
        if (itemType === ITEM_TYPE.DASHBOARDS) {
          return `${
            isUserOwner ? ROUTES.MY_DASHBOARD : ROUTES.DASHBOARD
          }/${itemClass.getId()}`;
        }
        return `${
          isUserOwner ? ROUTES.MY_QUERY : ROUTES.QUERY
        }/${itemClass.getId()}`;
      default:
        return ROUTES.HOME;
    }
  };

  const getTypeItem = () => {
    return type === LIST_ITEM_TYPE.MYWORK ? itemType || '' : type;
  };

  const _renderDropdown = (isNavMenu?: boolean) => {
    const menu = [QUERY_MENU_LIST.SAVE, QUERY_MENU_LIST.SHARE];
    return (
      !!item && (
        <>
          {isNavMenu ? (
            <>
              <Box
                display={{ base: 'none', lg: 'flex' }}
                className="article-dropdown"
              >
                <AppQueryMenu
                  menu={menu}
                  item={item}
                  itemType={getTypeItem()}
                  isSaved={isSaved}
                />
              </Box>
              <Box display={{ lg: 'none' }}>
                <AppQueryMenu
                  menu={menu}
                  item={item}
                  itemType={getTypeItem()}
                  isNavMenu={isNavMenu}
                  isSaved={isSaved}
                />
              </Box>
            </>
          ) : (
            <AppQueryMenu
              menu={menu}
              item={item}
              itemType={getTypeItem()}
              isNavMenu={isNavMenu}
              isSaved={isSaved}
            />
          )}
        </>
      )
    );
  };

  return (
    <>
      {displayed === DisplayType.Grid ? (
        <AppGridItem
          name={itemClass.getName()}
          creator={userName}
          date={moment(itemClass.getCreatedTime()).format('YYYY MMMM Do')}
          views={randomViews}
          toHref={getTitleUrl()}
          tagList={itemClass.getTags()}
          shareComponent={_renderDropdown()}
          srcThumb={itemClass.getThumnail() || ''}
          srcAvatar={itemClass.getUserAvatar()}
          userId={itemClass.getUserId()}
        />
      ) : (
        <AppRowItem
          name={itemClass.getName()}
          creator={userName}
          date={moment(itemClass.getCreatedTime()).format('YYYY MMMM Do')}
          views={randomViews}
          toHref={getTitleUrl()}
          tagList={itemClass.getTags()}
          shareComponent={_renderDropdown(true)}
          srcThumb={itemClass.getThumnail() || ''}
          srcAvatar={itemClass.getUserAvatar()}
          userId={itemClass.getUserId()}
          type={type}
          itemType={itemType}
        />
      )}
    </>
  );
};

export default ListItem;
