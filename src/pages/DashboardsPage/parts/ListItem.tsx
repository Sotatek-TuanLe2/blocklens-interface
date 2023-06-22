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

interface IListItem {
  isLoading?: boolean;
  type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  myWorkType?: typeof TYPE_MYWORK[keyof typeof TYPE_MYWORK];
  item?: IDashboardDetail | IQuery;
  displayed?: string;
}

const ListItem: React.FC<IListItem> = (props) => {
  const { type, myWorkType, item, displayed, isLoading } = props;

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
      menu = [QUERY_MENU_LIST.FORK, QUERY_MENU_LIST.SHARE];
    }

    return (
      !!item && (
        <AppQueryMenu
          menu={menu}
          item={item}
          itemType={getTypeItem()}
          isNavMenu={isNavMenu}
        />
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
          toHref={getTitleUrl()}
          tagList={listTags}
          chainList={itemClass.getChains()}
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
          toHref={getTitleUrl()}
          tagList={listTags}
          chainList={itemClass.getChains()}
          shareComponent={_renderDropdown()}
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
