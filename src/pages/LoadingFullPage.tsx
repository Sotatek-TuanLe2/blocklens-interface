import { Box, Flex, Skeleton } from '@chakra-ui/react';

export const LoadingFullPage = () => {
  return (
    <Flex flexWrap={'wrap'} mx={'-10px'}>
      {[...Array(14)].map((_, index) => {
        let maxW = '';
        let aspectRatio = '';
        switch (index) {
          case 6:
            maxW = '100%';
            aspectRatio = '1396 / 320';
            break;

          case 7:
          case 8:
          case 9:
          case 10:
            maxW = 'calc(100% / 4)';
            aspectRatio = '334 / 320';
            break;
          case 11:
          case 12:
          case 13:
            maxW = 'calc(100% / 3)';
            aspectRatio = '452 / 320';
            break;
          default:
            maxW = 'calc(50%)';
            aspectRatio = '688 / 320';
            break;
        }
        return (
          <Box key={index} p={'10px'} w={'full'} maxW={maxW} style={{ aspectRatio }}>
            <Box
              bg={'white'}
              rounded={'10px'}
              boxShadow={'0px 15px 30px rgba(0, 0, 0, 0.04)'}
              w={'full'}
              h={'full'}
              px={'24px'}
              py={'22px'}
            >
              <Flex align={'center'}>
                <Skeleton w={'130px'} h={'18px'} rounded={'9px'} mr={'10px'} />
                <Skeleton w={'130px'} h={'18px'} rounded={'9px'} />
              </Flex>
            </Box>
          </Box>
        );
      })}
    </Flex>
  );
};
