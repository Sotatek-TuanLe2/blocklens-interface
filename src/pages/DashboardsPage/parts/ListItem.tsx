import moment from 'moment';
import { AppGridItem, AppRowItem } from 'src/components';
import AppQueryMenu, { QUERY_MENU_LIST } from 'src/components/AppQueryMenu';
import { DisplayType } from 'src/constants';
import { ROUTES } from 'src/utils/common';
import { IDashboardDetail, IQuery } from 'src/utils/query.type';
import { Dashboard } from 'src/utils/utils-dashboard';
import { Query } from 'src/utils/utils-query';
import { LIST_ITEM_TYPE } from '..';
import { listTags, TYPE_MYWORK } from './FilterSearch';
import { Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { formatNumber } from 'src/utils/utils-format';
import { generatePositiveRandomNumber } from 'src/utils/utils-helper';

interface IListItem {
  isLoading?: boolean;
  type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  myWorkType?: typeof TYPE_MYWORK[keyof typeof TYPE_MYWORK];
  item?: IDashboardDetail | IQuery;
  displayed?: string;
}

const ListItem: React.FC<IListItem> = (props) => {
  const { type, myWorkType, item, displayed, isLoading } = props;

  const randomViews = useMemo(
    () => formatNumber(generatePositiveRandomNumber(1000), 2),
    [item?.id],
  );

  if (isLoading) {
    return displayed === DisplayType.Grid ? (
      <AppGridItem isLoading />
    ) : (
      <AppRowItem isLoading type={type} myWorkType={myWorkType} />
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
        if (myWorkType === TYPE_MYWORK.DASHBOARDS) {
          return `${ROUTES.MY_DASHBOARD}/${itemClass.getId()}`;
        }
        return `${ROUTES.MY_QUERY}/${itemClass.getId()}`;
      default:
        return ROUTES.HOME;
    }
  };

  const getTypeItem = () => {
    return type === LIST_ITEM_TYPE.MYWORK ? myWorkType || '' : type;
  };

  const _renderDropdown = (isNavMenu?: boolean) => {
    let menu = [];
    if (type === LIST_ITEM_TYPE.DASHBOARDS) {
      menu.push(QUERY_MENU_LIST.SHARE);
    } else {
      menu = [
        // QUERY_MENU_LIST.FORK,
        QUERY_MENU_LIST.SHARE,
      ];
    }

    return (
      !!item && (
        <>
          {isNavMenu ? (
            <>
              <Box
                display={{ base: 'none', lg: 'flex' }}
                justifyContent={'center'}
                alignItems={'center'}
                w={'24px'}
                h={'24px'}
                borderRadius={'12px'}
                bg={'rgba(0, 2, 36, 0.05)'}
              >
                <AppQueryMenu
                  menu={menu}
                  item={item}
                  itemType={getTypeItem()}
                />
              </Box>
              <Box display={{ lg: 'none' }}>
                <AppQueryMenu
                  menu={menu}
                  item={item}
                  itemType={getTypeItem()}
                  isNavMenu={isNavMenu}
                />
              </Box>
            </>
          ) : (
            <AppQueryMenu
              menu={menu}
              item={item}
              itemType={getTypeItem()}
              isNavMenu={isNavMenu}
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
          tagList={listTags}
          shareComponent={_renderDropdown()}
          srcThumb={itemClass.getThumnail()!}
          srcAvatar={itemClass.getUser().avatar}
          userId={itemClass.getUser().userId}
        />
      ) : (
        <AppRowItem
          name={itemClass.getName()}
          creator={userName}
          date={moment(itemClass.getCreatedTime()).format('YYYY MMMM Do')}
          views={randomViews}
          toHref={getTitleUrl()}
          tagList={listTags}
          shareComponent={_renderDropdown(true)}
          srcThumb={itemClass.getThumnail()!}
          srcAvatar={itemClass.getUser().avatar}
          userId={itemClass.getUser().userId}
          type={type}
          myWorkType={myWorkType}
        />
      )}
    </>
  );
};

export default ListItem;
