import {
  Box,
  Collapse,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import AppNetworkIcons from './AppNetworkIcons';
import AppTag from './AppTag';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { FC, ReactNode } from 'react';
import { LIST_ITEM_TYPE } from 'src/pages/DashboardsPage';

interface AppRowItemProps {
  isLoading?: boolean;
  toHref?: string;
  srcThumb?: string;
  srcAvatar?: string;
  name?: string;
  creator?: string;
  date?: string;
  chainList?: any[];
  tagList?: any[];
  shareComponent?: ReactNode;
  type?: string;
  myWorkType?: string;
}

const AppRowItem: FC<AppRowItemProps> = ({
  isLoading,
  toHref,
  srcThumb,
  srcAvatar,
  name,
  creator,
  date,
  chainList,
  tagList,
  shareComponent,
  type,
  myWorkType,
}) => {
  const { isOpen, onToggle } = useDisclosure();

  const _renderRow = () => {
    if (isLoading) {
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
            <Flex align={'center'}>
              {(type === LIST_ITEM_TYPE.DASHBOARDS ||
                myWorkType === LIST_ITEM_TYPE.DASHBOARDS) && (
                <Skeleton
                  color={'#E5E6E9'}
                  opacity={'1 !important'}
                  rounded={'6px'}
                  mr={3}
                >
                  <Box
                    h={'48px'}
                    minW={'74px'}
                    style={{ aspectRatio: '74 / 48' }}
                  ></Box>
                </Skeleton>
              )}
              <Skeleton
                color={'#E5E6E9'}
                opacity={'1 !important'}
                h={'18px'}
                w={'150px'}
                rounded={'9px'}
                mr={3}
              />
            </Flex>
          </Flex>
          <Flex flexGrow={1} w={'22%'} overflow={'hidden'} pr={2.5}>
            <Flex align={'center'}>
            <SkeletonCircle
              color={'#E5E6E9'}
              opacity={'1 !important'}
              w={'24px'}
              h={'24px'}
              mr={'8px'}
            />
            <Skeleton
              color={'#E5E6E9'}
              opacity={'1 !important'}
              w={'70px'}
              h={'18px'}
              rounded={'9px'}
            />
            </Flex>
          </Flex>
          <Flex flexGrow={1} w={'15%'} overflow={'hidden'} pr={2.5}>
            <Flex align={'center'}>
              {[...Array(4)].map((_, index) => (
                <SkeletonCircle
                  key={index}
                  color={'#E5E6E9'}
                  opacity={'1 !important'}
                  w={'24px'}
                  h={'24px'}
                  mr={index !== 3 ? '-5px' : '0'}
                />
              ))}
            </Flex>
          </Flex>
          <Flex flexGrow={1} w={'15%'} overflow={'hidden'} pr={2.5}>
            <Skeleton
              color={'#E5E6E9'}
              opacity={'1 !important'}
              w={'100px'}
              h={'18px'}
              rounded={'9px'}
            />
          </Flex>
          <Flex
            flexGrow={1}
            w={'calc(26% - 24px)'}
            overflow={'hidden'}
            pr={2.5}
          >
            <Skeleton
              color={'#E5E6E9'}
              opacity={'1 !important'}
              w={'200px'}
              h={'18px'}
              rounded={'9px'}
            />
          </Flex>
          <Flex justify={'center'} align={'center'} w={'24px'} h={'24px'}>
            <SkeletonCircle
              color={'#E5E6E9'}
              opacity={'1 !important'}
              w={'24px'}
              h={'24px'}
            />
          </Flex>
        </Flex>
      );
    }
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
          <Link to={toHref || '#'} style={{ width: '100%' }}>
            <Flex align={'center'}>
              {(type === LIST_ITEM_TYPE.DASHBOARDS ||
                myWorkType === LIST_ITEM_TYPE.DASHBOARDS) && (
                <Box
                  h={'48px'}
                  minW={'74px'}
                  overflow={'hidden'}
                  style={{ aspectRatio: '74 / 48' }}
                  mr={3}
                >
                  <Image
                    src={srcThumb || '/images/ThumbnailDashboard.png'}
                    alt="thumbnail"
                    w={'auto'}
                    height={'full'}
                    minW={'full'}
                  />
                </Box>
              )}
              {name && (
                <Tooltip p={2} hasArrow placement="top" label={name}>
                  <Box className="article-name">{name}</Box>
                </Tooltip>
              )}
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
            src={srcAvatar || '/images/AvatarDashboardCard.png'}
            alt="avatar"
          />
          <Text ml={2} className="article-row-creator">
            {creator && creator}
          </Text>
        </Flex>
        <Flex flexGrow={1} w={'15%'} overflow={'hidden'} pr={2.5}>
          {chainList && <AppNetworkIcons networkIds={chainList} />}
        </Flex>
        <Flex flexGrow={1} w={'15%'} overflow={'hidden'} pr={2.5}>
          {date && creator}
        </Flex>
        <Flex flexGrow={1} w={'calc(26% - 24px)'} overflow={'hidden'} pr={2.5}>
          {tagList &&
            tagList.map((item) => (
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
          {shareComponent && shareComponent}
        </Flex>
      </Flex>
    );
  };

  const _renderRowMobile = () => {
    if (isLoading) {
      return (
        <Box
          boxShadow={'0px 15px 30px rgba(0, 0, 0, 0.04)'}
          mb={3}
          p={4}
          className="article"
        >
          <Flex align={'center'}>
            <Box flexGrow={1} maxW={'calc(100% - 50px)'}>
              <Flex align={'center'}>
                {type === LIST_ITEM_TYPE.DASHBOARDS && (
                  <Skeleton
                    color={'#E5E6E9'}
                    opacity={'1 !important'}
                    rounded={'6px'}
                    mr={'10px'}
                  >
                    <Box h={'48px'} style={{ aspectRatio: '74 / 48' }}></Box>
                  </Skeleton>
                )}
                <Box maxW={'calc(100% - 84px)'} overflow={'hidden'}>
                  <Skeleton
                    color={'#E5E6E9'}
                    opacity={'1 !important'}
                    w={'150px'}
                    h={'18px'}
                    rounded={'9px'}
                  />
                  <Flex>
                    {[...Array(4)].map((_, index) => (
                      <SkeletonCircle
                        key={index}
                        color={'#E5E6E9'}
                        opacity={'1 !important'}
                        w={'24px'}
                        h={'24px'}
                        mr={index !== 3 ? '-5px' : '0'}
                      />
                    ))}
                  </Flex>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Box>
      );
    }
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
          <Box flexGrow={1} maxW={'calc(100% - 50px)'}>
            <Link
              to={toHref || '#'}
              style={{ width: '100%', display: 'block' }}
            >
              <Flex align={'center'}>
                {type === LIST_ITEM_TYPE.DASHBOARDS && (
                  <Box
                    h={'48px'}
                    style={{ aspectRatio: '74 / 48' }}
                    mr={'10px'}
                    overflow={'hidden'}
                  >
                    <Image
                      w={'auto'}
                      minW={'full'}
                      height={'full'}
                      borderRadius={'6px'}
                      src={srcThumb || '/images/ThumbnailDashboard.png'}
                      alt="thumbnail"
                    />
                  </Box>
                )}
                <Box maxW={'calc(100% - 84px)'} overflow={'hidden'}>
                  <Text className="article-name">{name && name}</Text>
                  <Flex>
                    {chainList && <AppNetworkIcons networkIds={chainList} />}
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
                {creator && creator}
              </Text>
            </Flex>
            <Flex align={'center'} mb={3}>
              <Text className="m-article-label">Date</Text>
              <Text flexGrow={1} textAlign={'right'} className="m-article-date">
                {date && date}
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
                {tagList &&
                  tagList.map((item) => (
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
              {shareComponent && shareComponent}
            </Box>
          </Box>
        </Collapse>
      </Box>
    );
  };

  return (
    <>
      <Box display={{ base: 'none', lg: 'block' }}>{_renderRow()}</Box>
      <Box display={{ lg: 'none' }}>{_renderRowMobile()}</Box>
    </>
  );
};

export default AppRowItem;
