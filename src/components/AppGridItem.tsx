import {
  Box,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import AppTag from './AppTag';
import { FC, ReactNode } from 'react';
import 'src/styles/components/AppGridItem.scss';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { generateAvatarFromId } from 'src/utils/common';
import { IconEye } from 'src/assets/icons';
import useOriginPath from 'src/hooks/useOriginPath';

interface AppGridItemProps {
  isLoading?: boolean;
  toHref?: string;
  srcThumb?: string;
  srcAvatar?: string;
  name?: string;
  creator?: string;
  date?: string;
  chainList?: string[];
  tagList?: string[];
  shareComponent?: ReactNode;
  userId?: string;
  views?: number | string;
}

const AppGridItem: FC<AppGridItemProps> = ({
  isLoading,
  toHref,
  srcThumb,
  srcAvatar,
  name,
  creator,
  date,
  tagList,
  shareComponent,
  userId,
  views,
}) => {
  const location = useLocation();
  const { generateLinkObject } = useOriginPath();

  return isLoading ? (
    <Flex
      w={'full'}
      flexDir={'column'}
      justify={'stretch'}
      boxShadow={'0px 15px 30px rgba(0, 0, 0, 0.04)'}
      bg={'#fafafa'}
      borderRadius={{ base: '10px', lg: '14px' }}
      className="app-grid-item"
    >
      <Box
        borderTopLeftRadius={{ base: '10px', lg: '14px' }}
        borderTopRightRadius={{ base: '10px', lg: '14px' }}
        overflow={'hidden'}
        style={{ aspectRatio: '295 / 180' }}
      >
        <Skeleton w={'full'} h={'full'} />
      </Box>
      <Flex
        w={'full'}
        flexGrow={1}
        flexDir={'column'}
        justify={'flex-end'}
        p={4}
      >
        <Flex w={'full'}>
          <Box flexGrow={1} maxW={'100%'} overflow={'hidden'}>
            <Flex align={'center'} h={'24px'}>
              <Skeleton h={'14px'} w={'150px'} rounded={'7px'} />
            </Flex>
            <Flex mt={'6px'} h={'22px'}>
              <Skeleton h={'14px'} w={'200px'} rounded={'7px'} />
            </Flex>
          </Box>
          <Box>
            <SkeletonCircle
              w={{ base: '24px', lg: '22px' }}
              h={{ base: '24px', lg: '22px' }}
            />
          </Box>
        </Flex>
        <Divider
          my={{ base: '14px', lg: 4 }}
          colorScheme="rgba(0, 2, 36, 0.1)"
        />
        <Flex w={'full'}>
          <Flex align={'center'} flexGrow={1} h={'40px'}>
            <SkeletonCircle w={'34px'} h={'34px'} mr={'10px'} />
            <Box>
              <Skeleton h={'14px'} w={'100px'} mb={'4px'} rounded={'7px'} />
              <Skeleton h={'14px'} w={'50px'} rounded={'7px'} />
            </Box>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  ) : (
    <Flex
      w={'full'}
      flexDir={'column'}
      justify={'stretch'}
      boxShadow={'0px 15px 30px rgba(0, 0, 0, 0.04)'}
      bg={'#fafafa'}
      borderRadius={{ base: '10px', lg: '14px' }}
      className="app-grid-item"
    >
      <Box
        borderTopLeftRadius={{ base: '10px', lg: '14px' }}
        borderTopRightRadius={{ base: '10px', lg: '14px' }}
        overflow={'hidden'}
        style={{ aspectRatio: '295 / 180' }}
      >
        <Link
          to={generateLinkObject(
            toHref || '#',
            `${location.pathname}${location.search}`,
          )}
        >
          <Image
            src={srcThumb}
            alt="thumbnail"
            minW={'full'}
            minH={'full'}
            height={'full'}
            objectFit={'cover'}
            objectPosition={'center'}
            fallbackSrc="/images/ThumbnailDashboardLight.png"
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
          <Box flexGrow={1} maxW={'100%'} overflow={'hidden'}>
            <Link
              className="item-name"
              to={generateLinkObject(
                toHref || '#',
                `${location.pathname}${location.search}`,
              )}
              style={{ display: 'block' }}
            >
              <Tooltip p={2} hasArrow placement="top" label={name}>
                {name}
              </Tooltip>
            </Link>
            <Flex flexWrap={'wrap'} mt={{ base: 1, lg: 1.5 }} h={'23px'}>
              {!!tagList?.length &&
                tagList.map((item, index: number) => (
                  <AppTag
                    key={index}
                    value={item}
                    h={{ base: '24px', lg: '22px' }}
                    classNames="item-tag"
                  />
                ))}
            </Flex>
          </Box>
          <Box position={'relative'} pt={{ lg: '2px' }}>
            <Flex
              bg={'rgba(0, 2, 36, 0.05)'}
              w={{ base: '24px', lg: '22px' }}
              h={{ base: '24px', lg: '22px' }}
              borderRadius={{ base: '12px', lg: '11px' }}
              justify={'center'}
              align={'center'}
            >
              {shareComponent && shareComponent}
            </Flex>
          </Box>
        </Flex>
        <Divider
          my={{ base: '14px', lg: 4 }}
          colorScheme="rgba(0, 2, 36, 0.1)"
        />
        <Flex w={'full'}>
          <Flex align={'center'} flexGrow={1}>
            <Box w={'34px'} h={'34px'} borderRadius={'17px'} mr={2.5}>
              {srcAvatar ? (
                <Image src={srcAvatar} alt="avatar" />
              ) : (
                <Jazzicon
                  diameter={34}
                  seed={jsNumberForAddress(generateAvatarFromId(userId))}
                />
              )}
            </Box>
            <Box>
              <Text className="item-creator" mb={{ base: '2px', lg: 0 }}>
                {creator}
              </Text>
              <Text className="item-date">{date && date}</Text>
            </Box>
          </Flex>

          <Flex alignSelf={'flex-start'} alignItems={'center'}>
            <IconEye />
            <Text textAlign={'right'} className="item-view" ml={'4px'}>
              {views}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AppGridItem;
