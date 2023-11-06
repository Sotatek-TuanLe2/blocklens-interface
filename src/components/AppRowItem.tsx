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
import { Link, useLocation } from 'react-router-dom';
import AppTag from './AppTag';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { FC, ReactNode } from 'react';
import { INSIGHTS_TABS } from 'src/pages/DashboardsPage';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { generateAvatarFromId } from 'src/utils/common';
import { IconEye } from 'src/assets/icons';
import useOriginPath from 'src/hooks/useOriginPath';

interface AppRowItemProps {
  isLoading?: boolean;
  toHref?: string;
  srcThumb?: string;
  srcAvatar?: string;
  name?: string;
  creator?: string;
  date?: string;
  chainList?: any[];
  tagList?: string[];
  shareComponent?: ReactNode;
  type?: string;
  itemType?: string;
  userId?: string;
  views?: number | string;
}

const AppRowItem: FC<AppRowItemProps> = ({
  isLoading,
  toHref,
  srcThumb,
  srcAvatar,
  name,
  creator,
  date,
  tagList,
  shareComponent,
  type,
  itemType,
  userId,
  views,
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const location = useLocation();
  const { generateLinkObject } = useOriginPath();

  const _renderLoadingRow = () => {
    return (
      <Flex
        bg={'#fafafa'}
        boxShadow={'0px 15px 30px 0px #0000000A'}
        borderRadius={'10px'}
        mb={'6px'}
        px={'26px'}
        py={'16px'}
        maxW={'full'}
      >
        <Flex align={'center'} w={'calc(100% - 24px)'}>
          <Flex align={'center'} w={'24%'} pr={2.5}>
            {(type === INSIGHTS_TABS.DASHBOARDS ||
              itemType === INSIGHTS_TABS.DASHBOARDS) && (
              <Skeleton w={'74px'} h={'48px'} mr={'10px'} rounded={'6px'} />
            )}
            <Skeleton h={'18px'} w={'150px'} rounded={'9px'} />
          </Flex>

          <Flex align={'center'} w={'24%'} pr={2.5}>
            <SkeletonCircle w={'24px'} h={'24px'} rounded={'12px'} mr={'8px'} />
            <Skeleton h={'18px'} w={'70px'} rounded={'9px'} />
          </Flex>

          <Flex align={'center'} w={'16%'} pr={2.5}>
            <Skeleton h={'18px'} w={'100px'} rounded={'9px'} />
          </Flex>

          <Flex align={'center'} w={'10%'} pr={2.5}>
            <Skeleton h={'18px'} w={'70px'} rounded={'9px'} />
          </Flex>

          <Flex align={'center'} w={'26%'} pr={2.5}>
            <Skeleton h={'18px'} w={'200px'} rounded={'9px'} />
          </Flex>
        </Flex>

        <Flex w={'24px'} alignSelf={'stretch'} alignItems={'center'}>
          <SkeletonCircle w={'24px'} h={'24px'} rounded={'12px'} />
        </Flex>
      </Flex>
    );
  };

  const _renderRow = () => {
    return (
      <Flex
        bg={'#fafafa'}
        boxShadow={'0px 15px 30px 0px #0000000A'}
        borderRadius={'10px'}
        mb={'6px'}
        px={'26px'}
        maxW={'full'}
        className="article-row"
      >
        <Link
          to={generateLinkObject(
            toHref || '#',
            `${location.pathname}${location.search}`,
          )}
          style={{ width: 'calc(100% - 24px)', display: 'block' }}
        >
          <Flex align={'center'} py={'16px'}>
            <Flex align={'center'} w={'24%'} pr={2.5} overflow={'hidden'}>
              {(type === INSIGHTS_TABS.DASHBOARDS ||
                itemType === INSIGHTS_TABS.DASHBOARDS) && (
                <Box
                  style={{ aspectRatio: '74 / 48' }}
                  w={'74px'}
                  minW={'74px'}
                  mr={'12px'}
                  overflow={'hidden'}
                >
                  <Image
                    src={srcThumb}
                    alt="thumbnail"
                    w={'auto'}
                    minW={'full'}
                    height={'full'}
                    borderRadius={'6px'}
                    objectFit={'cover'}
                    objectPosition={'center'}
                    fallbackSrc="/images/ThumbnailDashboardLight.png"
                  />
                </Box>
              )}
              {name && (
                <Tooltip p={2} hasArrow placement="top" label={name}>
                  <Box className="article-name">{name}</Box>
                </Tooltip>
              )}
            </Flex>

            <Flex align={'center'} w={'24%'} pr={2.5} overflow={'hidden'}>
              <Flex minW={'24px'} align={'center'}>
                {srcAvatar ? (
                  <Image
                    w={'24px'}
                    h={'24px'}
                    borderRadius={'12px'}
                    objectFit={'cover'}
                    objectPosition={'center'}
                    src={srcAvatar}
                    alt="avatar"
                  />
                ) : (
                  <Jazzicon
                    diameter={24}
                    paperStyles={{ minWidth: '24px' }}
                    seed={jsNumberForAddress(generateAvatarFromId(userId))}
                  />
                )}
              </Flex>
              {creator && (
                <Text ml={2} className="article-creator">
                  {creator}
                </Text>
              )}
            </Flex>

            <Flex align={'center'} w={'16%'} pr={2.5} overflow={'hidden'}>
              {date && <Text className="article-date">{date}</Text>}
            </Flex>

            <Flex align={'center'} w={'10%'} pr={2.5}>
              <Flex align={'center'}>
                <IconEye />
                <Text textAlign={'right'} className="article-view" ml={'4px'}>
                  {views}
                </Text>
              </Flex>
            </Flex>

            <Flex align={'center'} w={'26%'} pr={2.5} overflow={'hidden'}>
              <Flex flexGrow={1}>
                {!!tagList?.length &&
                  tagList.map((item: string, index: number) => (
                    <AppTag
                      key={index}
                      value={item}
                      h={'24px'}
                      classNames="article-tag"
                    />
                  ))}
              </Flex>
            </Flex>
          </Flex>
        </Link>

        <Flex w={'24px'} py={'16px'} align={'center'}>
          {shareComponent && shareComponent}
        </Flex>
      </Flex>
    );
  };

  const _renderLoadingMobile = () => {
    return (
      <Box
        bg={'white'}
        boxShadow={'0px 15px 30px 0px #0000000A'}
        borderRadius={'10px'}
        mb={'12px'}
        p={4}
      >
        <Flex align={'center'}>
          <Box flexGrow={1}>
            <Flex align={'center'}>
              {(type === INSIGHTS_TABS.DASHBOARDS ||
                itemType === INSIGHTS_TABS.DASHBOARDS) && (
                <Skeleton w={'74px'} h={'48px'} mr={'10px'} rounded={'6px'} />
              )}
              <Box flexGrow={1}>
                <Skeleton w={'150px'} h={'18px'} rounded={'9px'} mb={'12px'} />

                <Flex align={'center'} overflow={'hidden'}>
                  <SkeletonCircle
                    h={'18px'}
                    w={'18px'}
                    rounded={'9px'}
                    mr={'8px'}
                  />
                  <Skeleton w={'70px'} h={'18px'} rounded={'9px'} />
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
    );
  };

  const _renderRowMobile = () => {
    return (
      <Box
        bg={'white'}
        boxShadow={'0px 15px 30px 0px #0000000A'}
        borderRadius={'10px'}
        mb={'12px'}
        p={4}
        className="m-article-row"
      >
        <Flex align={'center'}>
          <Box flexGrow={1} maxW={'calc(100% - 50px)'} overflow={'hidden'}>
            <Link
              to={generateLinkObject(
                toHref || '#',
                `${location.pathname}${location.search}`,
              )}
              style={{ width: '100%', display: 'block' }}
            >
              <Flex align={'center'}>
                {(type === INSIGHTS_TABS.DASHBOARDS ||
                  itemType === INSIGHTS_TABS.DASHBOARDS) && (
                  <Box
                    style={{ aspectRatio: '74 / 48' }}
                    w={'74px'}
                    minW={'74px'}
                    mr={'10px'}
                    overflow={'hidden'}
                  >
                    <Image
                      w={'auto'}
                      minW={'full'}
                      height={'full'}
                      borderRadius={'6px'}
                      src={srcThumb || '/images/ThumbnailDashboardLight.png'}
                      alt="thumbnail"
                    />
                  </Box>
                )}
                <Box flexGrow={1} maxW={'full'} overflow={'hidden'}>
                  {name && (
                    <Text
                      className="article-name"
                      mb={
                        type === INSIGHTS_TABS.DASHBOARDS ||
                        itemType === INSIGHTS_TABS.DASHBOARDS
                          ? '2px'
                          : '4px'
                      }
                    >
                      {name}
                    </Text>
                  )}
                  <Flex align={'center'} overflow={'hidden'}>
                    {srcAvatar ? (
                      <Image
                        w={'20px'}
                        minW={'20px'}
                        h={'20px'}
                        borderRadius={'10px'}
                        objectFit={'cover'}
                        objectPosition={'center'}
                        src={srcAvatar}
                        alt="avatar"
                      />
                    ) : (
                      <Jazzicon
                        diameter={20}
                        paperStyles={{ minWidth: '20px' }}
                        seed={jsNumberForAddress(generateAvatarFromId(userId))}
                      />
                    )}
                    <Text ml={2} className="article-row-creator">
                      {creator && creator}
                    </Text>
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
              fontSize={'22px'}
              fontWeight={500}
              color={'rgba(0, 2, 36, 0.5)'}
              transition={'all 0.2s linear'}
              transform={`rotate(${isOpen ? '90deg' : '0'})`}
            />
          </Flex>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <Box pt={4}>
            <Box pb={'14px'}>
              <Flex align={'center'} mb={'12px'}>
                <Text className="article-label">Date</Text>
                <Text flexGrow={1} textAlign={'right'} className="article-date">
                  {date && date}
                </Text>
              </Flex>
              <Flex align={'center'} mb={'12px'}>
                <Text className="article-label">View</Text>
                <Flex align={'center'} flexGrow={1} justify={'flex-end'}>
                  <IconEye />
                  <Text textAlign={'right'} className="article-view" ml={'4px'}>
                    {views}
                  </Text>
                </Flex>
              </Flex>
              <Flex align={'center'}>
                <Text className="article-label">Tag</Text>
                <Flex
                  flexGrow={1}
                  justify={'flex-end'}
                  flexWrap={'wrap'}
                  mt={{ base: 1, lg: 1.5 }}
                >
                  {!!tagList?.length &&
                    tagList.map((item, index: number) => (
                      <AppTag
                        key={index}
                        value={item}
                        h={'24px'}
                        classNames="article-tag"
                      />
                    ))}
                </Flex>
              </Flex>
            </Box>
            <Box py={2}>{shareComponent && shareComponent}</Box>
          </Box>
        </Collapse>
      </Box>
    );
  };

  return (
    <>
      <Box display={{ base: 'none', lg: 'block' }}>
        {isLoading ? _renderLoadingRow() : _renderRow()}
      </Box>
      <Box display={{ lg: 'none' }}>
        {isLoading ? _renderLoadingMobile() : _renderRowMobile()}
      </Box>
    </>
  );
};

export default AppRowItem;
