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
import { Link } from 'react-router-dom';
import AppTag from './AppTag';
import AppNetworkIcons from './AppNetworkIcons';
import { FC, ReactNode } from 'react';
import 'src/styles/components/AppGridItem.scss';
import Jazzicon from 'react-jazzicon';

interface AppGridItemProps {
  isLoading?: boolean;
  toHref?: string;
  srcThumb?: string;
  srcAvatar?: string;
  name?: string;
  creator?: string;
  date?: string;
  chainList?: string[];
  tagList?: any[];
  shareComponent?: ReactNode;
  userId?: string;
}

const AppGridItem: FC<AppGridItemProps> = ({
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
  userId,
}) => {
  return isLoading ? (
    <Flex
      w={'full'}
      flexDir={'column'}
      justify={'stretch'}
      boxShadow={'0px 15px 30px rgba(0, 0, 0, 0.04)'}
      bg={'white'}
      borderRadius={{ base: '10px', lg: '14px' }}
      className="app-grid-item"
    >
      <Skeleton
        startColor="#E5E6E9"
        endColor="#BFC2C9"
        opacity={'1 !important'}
      >
        <Box
          borderTopLeftRadius={{ base: '10px', lg: '14px' }}
          borderTopRightRadius={{ base: '10px', lg: '14px' }}
          overflow={'hidden'}
          style={{ aspectRatio: '295 / 180' }}
        ></Box>
      </Skeleton>
      <Flex
        w={'full'}
        flexGrow={1}
        flexDir={'column'}
        justify={'flex-end'}
        p={4}
      >
        <Flex w={'full'}>
          <Box flexGrow={1} maxW={'100%'} overflow={'hidden'}>
            <Skeleton
              startColor="#E5E6E9"
              endColor="#BFC2C9"
              opacity={'1 !important'}
              h={'14px'}
              w={'150px'}
              mb={'10px'}
              rounded={'7px'}
            />
            <Skeleton
              startColor="#E5E6E9"
              endColor="#BFC2C9"
              opacity={'1 !important'}
              h={'14px'}
              w={'200px'}
              rounded={'7px'}
            />
          </Box>
          <Box>
            <SkeletonCircle
              startColor="#E5E6E9"
              endColor="#BFC2C9"
              opacity={'1 !important'}
            >
              <Flex
                w={{ base: '24px', lg: '22px' }}
                h={{ base: '24px', lg: '22px' }}
              />
            </SkeletonCircle>
          </Box>
        </Flex>
        <Divider
          my={{ base: '14px', lg: 4 }}
          colorScheme="rgba(0, 2, 36, 0.1)"
        />
        <Flex w={'full'}>
          <Flex align={'center'} flexGrow={1}>
            <SkeletonCircle w={'34px'} h={'34px'} mr={'10px'} />
            <Box>
              <Skeleton
                startColor="#E5E6E9"
                endColor="#BFC2C9"
                opacity={'1 !important'}
                h={'14px'}
                w={'100px'}
                mb={'4px'}
                rounded={'7px'}
              />
              <Skeleton
                startColor="#E5E6E9"
                endColor="#BFC2C9"
                opacity={'1 !important'}
                h={'14px'}
                w={'50px'}
                rounded={'7px'}
              />
            </Box>
          </Flex>
          <Flex align={'center'}>
            {[...Array(4)].map((_, index) => (
              <SkeletonCircle
                key={index}
                startColor="#E5E6E9"
                endColor="#BFC2C9"
                opacity={'1 !important'}
                w={'18px'}
                h={'18px'}
                mr={index !== 3 ? '-5px' : '0'}
              />
            ))}
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
      bg={'white'}
      borderRadius={{ base: '10px', lg: '14px' }}
      className="app-grid-item"
    >
      <Box
        borderTopLeftRadius={{ base: '10px', lg: '14px' }}
        borderTopRightRadius={{ base: '10px', lg: '14px' }}
        overflow={'hidden'}
        style={{ aspectRatio: '295 / 180' }}
      >
        <Link to={toHref || '#'}>
          <Image
            src={srcThumb || '/images/ThumbnailDashboardLight.png'}
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
          <Box flexGrow={1} maxW={'100%'} overflow={'hidden'}>
            <Link
              className="item-name"
              to={toHref || '#'}
              style={{ display: 'block' }}
            >
              <Tooltip p={2} hasArrow placement="top" label={name}>
                {name}
              </Tooltip>
            </Link>
            <Flex flexWrap={'wrap'} mt={{ base: 1, lg: 1.5 }}>
              {tagList &&
                tagList.map((item) => (
                  <AppTag
                    key={item.id}
                    value={item.name}
                    h={{ base: '24px', lg: '22px' }}
                    classNames="item-tag"
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
                  seed={Number(userId?.replace(/[a-z -]/gm, ''))}
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
          <Flex align={'center'}>
            {chainList && <AppNetworkIcons networkIds={chainList} />}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AppGridItem;
