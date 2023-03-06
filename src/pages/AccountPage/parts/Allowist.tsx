import 'src/styles/pages/AccountPage.scss';
import { Box, Flex } from '@chakra-ui/react';
import { AppCard, AppField, AppInput } from 'src/components';
import { AddIcon } from 'src/assets/icons';
import React from 'react';

const Allowist = () => {
  return (
    <AppCard className="box-info-account allowist">
      <Box className="user-api__title">Allowist</Box>

      <Box>
        <Flex flexWrap={'wrap'} justifyContent={'space-between'}>
          <AppField
            label={'Domain'}
            customWidth={'20%'}
            note="Prevent third-parties from using your key to interact with their own contract by only allowing reads and writes to your own addresses. To allow all addresses, leave this section empty."
          >
            <AppInput placeholder="Name (optional)" />
          </AppField>

          <AppField label={''} customWidth={'79%'}>
            <AppInput
              endAdornment={
                <Flex mr={10} className="btn-add">
                  <AddIcon /> <Box ml={2}>Add</Box>
                </Flex>
              }
            />
          </AppField>
        </Flex>
      </Box>
    </AppCard>
  );
};

export default Allowist;
