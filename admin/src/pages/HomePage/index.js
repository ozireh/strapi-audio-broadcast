/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import { BaseHeaderLayout, Box, Button, ContentLayout, HeaderLayout, Table, Thead, Tr, Th, Tbody, Td, Typography, BaseCheckbox, Tooltip, ToggleInput, Flex, Grid, IconButton, IconButtonGroup, ModalLayout, ModalHeader, ModalBody, TextInput, CarouselInput, CarouselSlide, CarouselImage, CarouselActions, ActionLayout, Tag, EmptyStateLayout } from '@strapi/design-system';
import trackRequests from '../../api/track';
import { ArrowDown, ArrowUp, Information, Pencil, Play, Plus, Trash } from '@strapi/icons';
import queueSettingsRequests from '../../api/queueSettings';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [initialSettings, setInitialSettings] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [tracks, setTracks] = useState([])
  const [queue, setQueue] = useState([])
  const [settings, setSettings] = useState({})
  const nonQueuedTracks = tracks.filter((track) => !queue.includes(track.id))
  const queuedTracks = queue.map(id => tracks.find((track) => track.id === id))

  const hasSettingsChanged = !!initialSettings && JSON.stringify(initialSettings.queue) !== JSON.stringify(settings.queue)

  const addTrackToQueue = track => {
    if (!queue.includes(track.id)) {
      setQueue([...queue, track.id])
    }
  }

  const moveTrackUp = track => {
    const index = queue.indexOf(track)
    const newQueue = [...queue]
    newQueue.splice(index, 1)
    newQueue.splice(index - 1, 0, track)
    setQueue(newQueue)
  }

  const moveTrackDown = track => {
    const index = queue.indexOf(track)
    const newQueue = [...queue]
    newQueue.splice(index, 1)
    newQueue.splice(index + 1, 0, track)
    setQueue(newQueue)
  }

  const removeTrackFromQueue = track => {
    const index = queue.indexOf(track)
    const newQueue = [...queue]
    newQueue.splice(index, 1)
    setQueue(newQueue)
  }

  const saveSettings = async () => {
    setIsLoading(true)
    try {
      const data = {
        id: settings.id,
        queue: queue
      }
  
      const response = await queueSettingsRequests.updateSettings(data)
      setInitialSettings(response?.data || {})
    } catch (error) {
      throw error
    }

    setIsLoading(false)
  }

  const play = async () => {
    try {
      await queueSettingsRequests.play()
    } catch (error) {
      throw error
    }

    setIsPlaying(true)
  }

  const pause = async () => {
    try {
      await queueSettingsRequests.pause()
    } catch (error) {
      throw error
    }

    setIsPlaying(false)
  }


  useEffect(() => {
    (async () => {
      try {
        const trackResponse = await trackRequests.getTracks()
        const settingsResponse = await queueSettingsRequests.getSettings()
  
        setTracks(trackResponse?.data || [])
        setSettings(settingsResponse?.data || {})
        setInitialSettings(settingsResponse?.data || {})
  
        if (settingsResponse?.data?.queue?.length) {
          setQueue(settingsResponse?.data?.queue)
        }
      } catch (error) {
        throw error
      }

      setIsLoading(false)
    })()
  }, []);

  useEffect(() => {
    setIsPlaying(initialSettings?.isPlaying)
  }, [initialSettings])
  
  useEffect(() => {
    setSettings({
      ...settings,
      queue: queue
    })
  }, [queue])  

  return (
    <div>

      <Box background="neutral100">
        <BaseHeaderLayout
          title="Audio Broadcast"
          subtitle="This is the plugin&apos;s description"
          primaryAction={
            <Button
              loading={isLoading}
              variant="secondary"
              disabled={!hasSettingsChanged}
              onClick={saveSettings}
            >
              Save
            </Button>
          }
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

            <ActionLayout
              startActions={
                <>
                  <Button
                    startIcon={<Play />}
                    loading={!!isPlaying}
                    disabled={!!isPlaying || !queue.length}
                    onClick={play}
                  >
                    { isPlaying ? 'On Air' : 'Stream' }
                  </Button>
                  {
                    !!isPlaying && (
                      <Button
                        onClick={pause}
                        variant='danger'
                      >
                        Stop
                      </Button>
                    )
                  }
                </>
              }
            />

            {/* all track can be added */}

            <ActionLayout
              startActions={
                <>
                  {
                    nonQueuedTracks?.length ? (
                      nonQueuedTracks
                        .map((item, index) =>
                          <Box
                            key={index}
                            paddingTop={2}
                            onClick={() => addTrackToQueue(item)}
                          >
                            <Tag key={index} icon={<Plus aria-hidden />}>
                              { item.title }
                            </Tag>
                          </Box>
                        )
                    ) : null
                  }
                </>
              }
            />

            {/* queue */}

            {
              queuedTracks?.length ? (
                <Table>  
                  <Thead>
                    <Tr>
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
                    {
                      queuedTracks.map((entry) => (
                        <Tr key={`queued-track-${entry.id}`}>
                          <Td>
                            <Box padding={2}>
                              <audio controls>
                                <source src={entry?.audioFile?.url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                            </Box>
                          </Td>
                          <Td>
                            <Typography textColor="neutral800">{ entry?.title }</Typography>
                          </Td>
                          <Td>
                            <IconButtonGroup>
                              <IconButton
                                label="Up"
                                icon={<ArrowUp />}
                                onClick={() => moveTrackUp(entry.id)}
                              />
                              <IconButton
                                label="Down"
                                icon={<ArrowDown />}
                                onClick={() => moveTrackDown(entry.id)}
                              />
                              <IconButton
                                label="Delete"
                                icon={<Trash />}
                                onClick={() => removeTrackFromQueue(entry.id)}
                              />
                            </IconButtonGroup>
                          </Td>
                        </Tr>
                        
                      ))
                    }
                  </Tbody>
                </Table>
              ) : (
                <Box background="neutral100">
                  <EmptyStateLayout content="You don't have any content yet..." />
                </Box>
              )
            }

          </Grid>
        </ContentLayout>
      </Box>
    </div>
  );
};

export default HomePage;
