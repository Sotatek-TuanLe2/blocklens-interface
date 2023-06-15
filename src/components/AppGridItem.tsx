import { Box, Divider, Flex, Image, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'recharts';
import AppTag from './AppTag';
import AppNetworkIcons from './AppNetworkIcons';
import { FC, ReactNode } from 'react';

interface AppGridItemProps {
  toHref: string;
  srcThumb?: string;
  name: string;
  creator: string;
  date: string;
  chainList?: string[];
  tagList: any[];
  shareComp: ReactNode;
}

const AppGridItem: FC<AppGridItemProps> = ({
  toHref,
  srcThumb,
  name,
  creator,
  date,
  chainList,
  tagList,
  shareComp,
}) => {
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
        <Link to={toHref}>
          <Image
            src={srcThumb || '/images/ThumbnailDashboard.png'}
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
              className="article-name"
              to={toHref}
              style={{ display: 'block' }}
            >
              <Tooltip p={2} hasArrow placement="top" label={name}>
                {name}
              </Tooltip>
            </Link>
            <Flex flexWrap={'wrap'} mt={{ base: 1, lg: 1.5 }}>
              {tagList.map((item) => (
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
              {shareComp}
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
                {creator}
              </Text>
              <Text className="article-date">{date}</Text>
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
