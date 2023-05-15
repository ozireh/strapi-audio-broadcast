/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import { BaseHeaderLayout, Box, Button, ContentLayout, HeaderLayout, Table, Thead, Tr, Th, Tbody, Td, Typography, BaseCheckbox, Tooltip, ToggleInput, Flex, Grid, IconButton } from '@strapi/design-system';
import trackRequests from '../../api/track';
import { ArrowDown, ArrowUp, Information } from '@strapi/icons';
import queueSettingsRequests from '../../api/queueSettings';

const HomePage = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [tracks, setTracks] = useState([])
  const [settings, setSettings] = useState({})
  useEffect(() => {
    (async () => {
      const trackResponse = await trackRequests.getTracks()
      const settingsResponse = await queueSettingsRequests.getSettings()
      
      setTracks(trackResponse?.data || [])
      setSettings(settingsResponse?.data || {})

    })()
  }, []);

  useEffect(() => {
    console.log(settings);
  }, [settings])
  

  return (
    <div>

      <Box background="neutral100">
        <BaseHeaderLayout
          title={pluginId}
          subtitle="This is the plugin&apos;s description"
        />
        <ContentLayout>
          <Grid
            gridCols={1}
            gap={{
              desktop: 5,
              tablet: 2,
              mobile: 1
            }}
          >

            <ToggleInput
              label="On airee"
              name="enable-provider"
              onLabel="True"
              offLabel="False"
              checked={!!isPlaying}
              onChange={() => setIsPlaying(!isPlaying)}
            />

            <Table>  
              <Thead>
                <Tr>
                  <Th>
                    <BaseCheckbox aria-label="Select all entries" />
                  </Th>
                  <Th>
                    <Typography variant="sigma">ID</Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma">Title</Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma">Order</Typography>
                  </Th>
                  {/* <Th>
                    <Typography variant="sigma">Description</Typography>
                  </Th> */}
                </Tr>
              </Thead>
              <Tbody>
                { tracks?.length && tracks.map((entry) => (
                  <Tr>
                    <Td>
                      <BaseCheckbox aria-label={`Select`} />
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">{ entry.id }</Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">{ entry?.title }</Typography>
                      {/* <Avatar src={entry.cover} alt={entry.contact} /> */}
                    </Td>
                    <Td>
                      <IconButton label="Up" icon={<ArrowUp />} />
                      <IconButton label="Down" icon={<ArrowDown />} />
                    </Td>
                  </Tr>
                  
                )) }
              </Tbody>
            </Table>

          </Grid>
        </ContentLayout>
      </Box>
    </div>
  );
};

export default HomePage;
