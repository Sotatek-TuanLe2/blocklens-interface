import {
  Box,
  Collapse,
  Divider,
  Flex,
  Image,
  Td,
  Text,
  Tooltip,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import { AppTag } from 'src/components';
import AppNetworkIcons from 'src/components/AppNetworkIcons';
import { DisplayType } from 'src/constants';
import { ROUTES } from 'src/utils/common';
import { IDashboardDetail, IQuery } from 'src/utils/query.type';
import { Dashboard } from 'src/utils/utils-dashboard';
import { Query } from 'src/utils/utils-query';
import { LIST_ITEM_TYPE } from '..';
import { listTags, TYPE_MYWORK } from './FilterSearch';
import AppQueryMenu, { QUERY_MENU_LIST } from 'src/components/AppQueryMenu';
import { ChevronRightIcon } from '@chakra-ui/icons';

interface IListItem {
  type: typeof LIST_ITEM_TYPE[keyof typeof LIST_ITEM_TYPE];
  myWorkType?: typeof TYPE_MYWORK[keyof typeof TYPE_MYWORK];
  item?: IDashboardDetail | IQuery;
  visibility?: 'COLUMN' | 'ROW';
  displayed?: string;
}

const ListItem: React.FC<IListItem> = (props) => {
  const { type, myWorkType, item, visibility, displayed } = props;
  const itemClass =
    type === LIST_ITEM_TYPE.DASHBOARDS
      ? new Dashboard(item as IDashboardDetail)
      : new Query(item as IQuery);

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

  const _renderGridItem = () => {
    return (
      <Box
        className="dashboard-list__item--column"
        w={'100% !important'}
        px={'0 !important'}
      >
        <Flex flexDirection="column" alignItems={'center'} w={'full'}>
          <Box
            className="dashboard-list__item--column__avatar"
            w={'100% !important'}
          >
            <Link to={getTitleUrl()}>
              <img
                src={
                  itemClass.getThumnail() || '/images/ThumbnailDashboard.png'
                }
                alt="thumbnail"
                className="thumbnail"
              />
            </Link>
            {/* <div className="dashboard-list__item--column__box-favourite">
              {favorite ? (
                <IconHeartFavorite onClick={() => setFavorite((pre) => !pre)} />
              ) : (
                <IconHeart onClick={() => setFavorite((pre) => !pre)} />
              )}
              25
            </div> */}
          </Box>
          <Box className="dashboard-list__item--column__content" px={4}>
            <Flex
              className="dashboard-list__item--column__content__title"
              alignItems={'center'}
            >
              <Flex flexDirection={'column'}>
                <Link className="item-name" to={getTitleUrl()}>
                  <Tooltip
                    p={2}
                    hasArrow
                    placement="top"
                    label={itemClass.getName()}
                  >
                    {itemClass.getName()}
                  </Tooltip>
                </Link>
                <Flex
                  flexWrap={'wrap'}
                  flexDirection={'row'}
                  maxW={52}
                  className="tag"
                >
                  {listTags.map((item) => (
                    <AppTag key={item.id} value={item.name} />
                  ))}
                </Flex>
              </Flex>
              <div className="item-options">{_renderDropdown()}</div>
            </Flex>
            <Flex
              mt={'14px'}
              flexDirection={'row'}
              justifyContent="space-between"
            >
              <Flex flexDirection={'row'}>
                <img src="/images/AvatarDashboardCard.png" alt="avatar" />
                <div className="dashboard-list__item--column__content__item-desc">
                  <Text>Tyler Covington</Text>
                  <Text>
                    {moment(itemClass.getCreatedTime()).format('YYYY MMMM Do')}
                  </Text>
                </div>
              </Flex>
              {itemClass.getChains() && (
                <AppNetworkIcons networkIds={itemClass.getChains()} />
              )}
            </Flex>
          </Box>
        </Flex>
      </Box>
    );
  };

  const _renderGridItemNew = () => {
    return (
      <Flex
        w={'full'}
        flexDir={'column'}
        justify={'stretch'}
        boxShadow={'0px 15px 30px rgba(0, 0, 0, 0.04)'}
        bg={'white'}
        borderRadius={{ base: '10px', lg: '14px' }}
        className="article"
      >
        <Box
          borderTopLeftRadius={{ base: '10px', lg: '14px' }}
          borderTopRightRadius={{ base: '10px', lg: '14px' }}
          overflow={'hidden'}
          style={{ aspectRatio: '295 / 180' }}
        >
          <Link to={getTitleUrl()}>
            <Image
              src={itemClass.getThumnail() || '/images/ThumbnailDashboard.png'}
              alt="thumbnail"
              minW={'full'}
              minH={'full'}
              objectFit={'cover'}
              objectPosition={'center'}
            />
          </Link>
        </Box>
        <Flex
          w={'full'}
          flexGrow={1}
          flexDir={'column'}
          justify={'flex-end'}
          p={4}
        >
          <Flex w={'full'}>
            <Box flexGrow={1}>
              <Link className="article-name" to={getTitleUrl()}>
                <Tooltip
                  p={2}
                  hasArrow
                  placement="top"
                  label={itemClass.getName()}
                >
                  {itemClass.getName()}
                </Tooltip>
              </Link>
              <Flex flexWrap={'wrap'} mt={{ base: 1, lg: 1.5 }}>
                {listTags.map((item) => (
                  <AppTag
                    key={item.id}
                    value={item.name}
                    h={{ base: '24px', lg: '22px' }}
                    classNames="article-tag"
                  />
                ))}
              </Flex>
            </Box>
            <Box>
              <Flex
                bg={'rgba(0, 2, 36, 0.05)'}
                w={{ base: '24px', lg: '22px' }}
                h={{ base: '24px', lg: '22px' }}
                borderRadius={{ base: '12px', lg: '11px' }}
                justify={'center'}
                align={'center'}
              >
                {_renderDropdown()}
              </Flex>
            </Box>
          </Flex>
          <Divider
            my={{ base: '14px', lg: 4 }}
            colorScheme="rgba(0, 2, 36, 0.1)"
          />
          <Flex w={'full'}>
            <Flex align={'center'} flexGrow={1}>
              <Box mr={2.5}>
                <Image src="/images/AvatarDashboardCard.png" alt="avatar" />
              </Box>
              <Box>
                <Text className="article-creator" mb={{ base: '2px', lg: 0 }}>
                  Tyler Covington
                </Text>
                <Text className="article-date">
                  {moment(itemClass.getCreatedTime()).format('YYYY MMMM Do')}
                </Text>
              </Box>
            </Flex>
            <Flex align={'center'}>
              {itemClass.getChains() && (
                <AppNetworkIcons networkIds={itemClass.getChains()} />
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  };

  const _renderRowItem = () => {
    return (
      <div className="dashboard-list__item--row theme-border">
        <Flex flexDirection="row" alignItems={'center'}>
          <Link
            to={getTitleUrl()}
            className="dashboard-list__item--row__avatar"
          >
            {type === LIST_ITEM_TYPE.DASHBOARDS && (
              <img
                src={
                  itemClass.getThumnail() || '/images/ThumbnailDashboard.png'
                }
                alt="thumbnail"
                className="thumbnail"
              />
            )}
            <Tooltip p={2} hasArrow placement="top" label={itemClass.getName()}>
              <div className="item-name">{itemClass.getName()}</div>
            </Tooltip>
          </Link>
          <div className="item-desc">
            <img src="/images/AvatarDashboardCard.png" alt="avatar" />
            <p>Tyler Covington</p>
          </div>
          <div className="item-chain">
            {itemClass.getChains() && (
              <AppNetworkIcons networkIds={itemClass.getChains()} />
            )}
          </div>
          <div className="item-date">
            {moment(itemClass.getCreatedTime()).format('YYYY MMMM Do')}
          </div>
          <div className="item-tag tag">
            {listTags.map((item) => (
              <AppTag key={item.id} value={item.name} />
            ))}
          </div>
          {/* <div className="item-favorite">
            {favorite ? (
              <IconHeartFavorite onClick={() => setFavorite((pre) => !pre)} />
            ) : (
              <IconHeart onClick={() => setFavorite((pre) => !pre)} />
            )}
            25
          </div> */}
          <div className="item-btn-options">{_renderDropdown()}</div>
        </Flex>
      </div>
    );
  };

  const _renderRowItemNew = () => {
    return (
      <Flex
        align={'center'}
        bg={'white'}
        boxShadow={'0px 15px 30px rgba(0, 0, 0, 0.04)'}
        borderRadius={'10px'}
        py={'16px'}
        px={'26px'}
        mb={'6px'}
        className="article"
      >
        <Flex flexGrow={1} w={'22%'} overflow={'hidden'} pr={2.5}>
          <Link to={getTitleUrl()}>
            <Flex align={'center'}>
              {(type === LIST_ITEM_TYPE.DASHBOARDS ||
                myWorkType === LIST_ITEM_TYPE.DASHBOARDS) && (
                <Box h={'48px'} style={{ aspectRatio: '74 / 48' }} mr={3}>
                  <Image
                    src={
                      itemClass.getThumnail() ||
                      '/images/ThumbnailDashboard.png'
                    }
                    alt="thumbnail"
                    w={'auto'}
                    height={'full'}
                  />
                </Box>
              )}
              <Tooltip
                p={2}
                hasArrow
                placement="top"
                label={itemClass.getName()}
              >
                <Box className="article-name">{itemClass.getName()}</Box>
              </Tooltip>
            </Flex>
          </Link>
        </Flex>
        <Flex flexGrow={1} w={'22%'} overflow={'hidden'} pr={2.5}>
          <Image
            w={'24px'}
            h={'24px'}
            borderRadius={'12px'}
            objectFit={'cover'}
            objectPosition={'center'}
            src="/images/AvatarDashboardCard.png"
            alt="avatar"
          />
          <Text ml={2} className="article-row-creator">
            Tyler Covington
          </Text>
        </Flex>
        <Flex flexGrow={1} w={'15%'} overflow={'hidden'} pr={2.5}>
          {itemClass.getChains() && (
            <AppNetworkIcons networkIds={itemClass.getChains()} />
          )}
        </Flex>
        <Flex flexGrow={1} w={'15%'} overflow={'hidden'} pr={2.5}>
          {moment(itemClass.getCreatedTime()).format('YYYY MMMM Do')}
        </Flex>
        <Flex flexGrow={1} w={'calc(26% - 24px)'} overflow={'hidden'} pr={2.5}>
          {listTags.map((item) => (
            <AppTag
              key={item.id}
              value={item.name}
              h={{ base: '24px', lg: '22px' }}
              classNames="article-tag"
            />
          ))}
        </Flex>
        <Flex
          justify={'center'}
          align={'center'}
          w={'24px'}
          h={'24px'}
          borderRadius={'12px'}
          bg={'rgba(0, 2, 36, 0.05)'}
        >
          {_renderDropdown()}
        </Flex>
      </Flex>
    );
  };

  const _renderRowItemMobile = () => {
    const { isOpen, onToggle } = useDisclosure();
    return (
      <Box
        bg={'white'}
        boxShadow={'0px 15px 30px rgba(0, 0, 0, 0.04)'}
        borderRadius={10}
        mb={3}
        p={4}
        className="article"
      >
        <Flex align={'center'}>
          <Box flexGrow={1}>
            <Link to={getTitleUrl()}>
              <Flex align={'center'}>
                {type === LIST_ITEM_TYPE.DASHBOARDS && (
                  <Box
                    h={'48px'}
                    style={{ aspectRatio: '74 / 48' }}
                    mr={'10px'}
                  >
                    <Image
                      w={'auto'}
                      height={'full'}
                      borderRadius={'6px'}
                      src={
                        itemClass.getThumnail() ||
                        '/images/ThumbnailDashboard.png'
                      }
                      alt="thumbnail"
                    />
                  </Box>
                )}
                <Box>
                  <Text className="article-name">{itemClass.getName()}</Text>
                  <Flex>
                    {itemClass.getChains() && (
                      <AppNetworkIcons networkIds={itemClass.getChains()} />
                    )}
                  </Flex>
                </Box>
              </Flex>
            </Link>
          </Box>
          <Flex
            w={'50px'}
            alignSelf={'stretch'}
            justify={'flex-end'}
            alignItems={'center'}
            onClick={onToggle}
            userSelect={'none'}
          >
            <ChevronRightIcon
              fontSize={'20px'}
              fontWeight={500}
              color={'rgba(0, 2, 36, 0.5)'}
              transition={'all 0.2s linear'}
              transform={`rotate(${isOpen ? '90deg' : '0'})`}
            />
          </Flex>
        </Flex>
        <Collapse in={isOpen} animateOpacity>
          <Box pt={4}>
            <Flex align={'center'} mb={3}>
              <Text className="m-article-label">Creator</Text>
              <Text
                className="m-article-creator"
                flexGrow={1}
                textAlign={'right'}
                ml={2}
              >
                Tyler Covington
              </Text>
            </Flex>
            <Flex align={'center'} mb={3}>
              <Text className="m-article-label">Date</Text>
              <Text flexGrow={1} textAlign={'right'} className="m-article-date">
                {moment(itemClass.getCreatedTime()).format('YYYY MMMM Do')}
              </Text>
            </Flex>
            <Flex align={'center'}>
              <Text className="m-article-label">Tag</Text>
              <Flex
                flexGrow={1}
                justify={'flex-end'}
                flexWrap={'wrap'}
                mt={{ base: 1, lg: 1.5 }}
              >
                {listTags.map((item) => (
                  <AppTag
                    key={item.id}
                    value={item.name}
                    h={{ base: '24px', lg: '22px' }}
                    classNames="article-tag"
                  />
                ))}
              </Flex>
            </Flex>
            <Box pt={5} pb={2}>
              {_renderDropdown(true)}
            </Box>
          </Box>
        </Collapse>
      </Box>
    );
  };

  return (
    <>
      {displayed === DisplayType.Grid ? (
        _renderGridItemNew()
      ) : (
        <>
          <Box display={{ base: 'none', lg: 'block' }}>
            {_renderRowItemNew()}
          </Box>
          <Box display={{ lg: 'none' }}>{_renderRowItemMobile()}</Box>
        </>
      )}
    </>
  );
};

export default ListItem;
