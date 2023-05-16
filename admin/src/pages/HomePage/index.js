/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import { BaseHeaderLayout, Box, Button, ContentLayout, HeaderLayout, Table, Thead, Tr, Th, Tbody, Td, Typography, BaseCheckbox, Tooltip, ToggleInput, Flex, Grid, IconButton, IconButtonGroup, ModalLayout, ModalHeader, ModalBody, TextInput, CarouselInput, CarouselSlide, CarouselImage, CarouselActions } from '@strapi/design-system';
import trackRequests from '../../api/track';
import { ArrowDown, ArrowUp, Information, Pencil, Play, Plus, Trash } from '@strapi/icons';
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
    if (tracks.length) {
      tracks.forEach((track, index) => {
        console.log(track.audioFile.url);
      })
    }
  }, [tracks])
  

  return (
    <div>

      <Box background="neutral100">
        <BaseHeaderLayout
          title="Audio Broadcast"
          subtitle="This is the plugin&apos;s description"
          // primaryAction={
          //   <Button onClick={() => setCreateTrackModal(true)} startIcon={<Plus />}>Add a track</Button>
          // }
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
                    <Typography variant="sigma">MP3</Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma">Title</Typography>
                  </Th>
                  <Th>
                    <Typography variant="sigma">Order</Typography>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                { tracks?.length && tracks.map((entry) => (
                  <Tr>
                    <Td>
                      <BaseCheckbox aria-label={`Select`} />
                    </Td>
                    <Td>
                        { entry?.audioFile?.src }
                        <audio controls>
                          <source src={entry?.audioFile?.url} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>

                    </Td>
                    <Td>
                      <Typography textColor="neutral800">{ entry?.title }</Typography>
                    </Td>
                    <Td>
                      <IconButtonGroup>
                        <IconButton label="Up" icon={<ArrowUp />} />
                        <IconButton label="Down" icon={<ArrowDown />} />
                      </IconButtonGroup>
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
