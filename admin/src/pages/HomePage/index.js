/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from 'react';
import pluginId from '../../pluginId';

import { BaseHeaderLayout, Box, Button, ContentLayout, Table, Thead, Tr, Th, Tbody, Td, Typography, Flex, Grid, IconButton, IconButtonGroup, ActionLayout, Tag, EmptyStateLayout, Link, Alert, Tooltip } from '@strapi/design-system';
import trackRequests from '../../api/track';
import { ArrowDown, ArrowUp, Play, Plus, Trash } from '@strapi/icons';
import queueSettingsRequests from '../../api/queueSettings';

const HomePage = () => {
  const [defaultAlert, setDefaultAlert] = useState(null)
  const [successAlert, setSuccessAlert] = useState(null)
  const [errorAlert, setErrorAlert] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [initialSettings, setInitialSettings] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [currentTrackInterval, setCurrentTrackInterval] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [tracks, setTracks] = useState([])
  const [queue, setQueue] = useState([])
  const [settings, setSettings] = useState({})
  const nonQueuedTracks = tracks.filter((track) => !queue.includes(track.id))
  const queuedTracks = queue.map(id => tracks.find((track) => track.id === id))

  const hasSettingsChanged = !!initialSettings && JSON.stringify(initialSettings.queue) !== JSON.stringify(settings.queue)

  // Functions 

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

  // Async functions

  const saveSettings = async () => {
    setIsLoading(true)
    try {
      const data = {
        id: settings.id,
        queue: queue
      }
  
      const response = await queueSettingsRequests.updateSettings(data)
      setSuccessAlert('Settings saved')
      setInitialSettings(response?.data || {})
    } catch (error) {
      setErrorAlert(error?.response?.data?.message || error?.message || 'An error occured')
      throw error
    }

    setIsLoading(false)
  }

  const play = async () => {
    try {
      await queueSettingsRequests.play()
    } catch (error) {
      setErrorAlert(error?.response?.data?.message || error?.message || 'An error occured')
      throw error
    }

    setDefaultAlert(null)
    setIsPlaying(true)
  }

  const pause = async () => {
    try {
      await queueSettingsRequests.pause()
      setCurrentTrack(null)
    } catch (error) {
      setErrorAlert(error?.response?.data?.message || error?.message || 'An error occured')
      throw error
    }

    setIsPlaying(false)
  }

  const checkCurrentTrack = async () => {
    try {
      const track = await queueSettingsRequests.getCurrentTrack()
      setCurrentTrack(track?.data || null)
    } catch (error) {
      setErrorAlert(error?.response?.data?.message || error?.message || 'An error occured')
      throw error
    }
  }

  const setNextTrack = async id => {
    try {
      const data = {
        id: settings.id,
        nextTrack: id
      }

      const response = await queueSettingsRequests.updateSettings(data)
      setDefaultAlert('Next track set')
      setInitialSettings(response?.data || {})
    } catch (error) {
      setErrorAlert(error?.response?.data?.message || error?.message || 'An error occured')
      throw error
    }
  }

  // Effects

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
        setErrorAlert(error?.response?.data?.message || error?.message || 'An error occured')
        throw error
      }

      setIsLoading(false)
    })()
  }, []);

  useEffect(() => {
    setIsPlaying(initialSettings?.isPlaying)
  }, [initialSettings])

  useEffect(() => {
    if (isPlaying) {
      checkCurrentTrack()
      setCurrentTrackInterval(setInterval(checkCurrentTrack, 15000))
    } else {
      clearInterval(currentTrackInterval)
      setCurrentTrackInterval(null)
    }
  }, [isPlaying])
  
  
  useEffect(() => {
    setSettings({
      ...settings,
      queue: queue
    })
  }, [queue])  

  return (
    <div>
      {
        defaultAlert && (
          <Alert
            closeLabel="Close alert"
            title="Alert"
            variant="default"
            onClose={() => setDefaultAlert(null)}
            action={
              !isPlaying && (
                <Link onClick={play}>
                  Start streaming now to hear your track
                </Link>
              )
            }
          >
            { defaultAlert }
          </Alert>
        )
      }
      {
        successAlert && (
          <Alert
            closeLabel="Close alert"
            title="Success"
            variant="success"
            onClose={() => setSuccessAlert(null)}
          >
            { successAlert }
          </Alert>
        )
      }
      {
        errorAlert && (
          <Alert
            closeLabel="Close alert"
            title="Error"
            variant="danger"
            onClose={() => setErrorAlert(null)}
          >
            { errorAlert }
          </Alert>
        )
      }
      <Box background="neutral100">
        <BaseHeaderLayout
          title="Audio Broadcast"
          subtitle="A plugin for Strapi to broadcast audio files"
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
                    disabled={!!isPlaying || !queue.length || !initialSettings?.queue?.length || !!hasSettingsChanged}
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

            {
              currentTrack && (
                <ActionLayout
                  startActions={
                    <Box>
                      <Flex>
                        <Box padding={1}>
                          <Typography variant="sigma">Now Playing:</Typography>
                        </Box>
                        <Box padding={1}>
                          <Typography variant="sigma">{ currentTrack?.title }</Typography>
                        </Box>
                      </Flex>
                      <Link href={`${window.location.origin}/strapi-audio-broadcast/stream`} isExternal>
                        Audio stream is available here
                      </Link>
                    </Box>
                  }
                />
              )
            }

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

            <ContentLayout>
              {
                queuedTracks?.length ? (
                  <Table>  
                    <Thead>
                      <Tr>
                        <Th>
                          <Typography variant="sigma">State</Typography>
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
                      {
                        queuedTracks.map((entry) => (
                          <Tr key={`queued-track-${entry.id}`}>
                            <Td>
                              {
                                currentTrack?.id === entry?.id ? (
                                  <Button
                                    loading
                                    variant='secondary'
                                  >
                                    Is playing
                                  </Button>
                                ) : initialSettings?.nextTrack?.id === entry?.id ? (
                                  <Button
                                    loading
                                    onClick={() => setNextTrack(null)}
                                    variant='secondary'
                                  >
                                    Imminent play
                                  </Button>
                                ) : !currentTrack ? (
                                  <Tooltip description="Click to set as next track">
                                    <Button
                                      variant='secondary'
                                      onClick={() => setNextTrack(entry?.id)}
                                      startIcon={<Play />}
                                    >
                                      Next play
                                    </Button>
                                  </Tooltip>
                                ) : (
                                  <Tooltip description="Click to set as next track">
                                    <Button
                                      variant='tertiary'
                                      onClick={() => setNextTrack(entry?.id)}
                                      startIcon={<Play />}
                                    >
                                      Queued
                                    </Button>
                                  </Tooltip>
                                )
                              }
                            </Td>
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
            </ContentLayout>
          </Grid>
      </Box>
    </div>
  );
};

export default HomePage;
