'use strict';
const Queue = require('../../admin/src/utils/queue')

module.exports = ({ strapi }) => ({
  async find() {
    try {
      const ctx = strapi.requestContext.get()
  
      const queueSettings = await strapi.entityService.findOne(
        'plugin::strapi-audio-broadcast.queue-setting',
        ctx.query
      );
  
      return queueSettings;
    } catch (error) {
      throw error  
    }
  },
  async init() {    
    strapi.queue = new Queue({
      protocol: strapi.config.get('server.protocol'),
      host: strapi.config.get('server.host'),
      port: strapi.config.get('server.port'),
    })

    const tracks = await strapi.entityService.findMany(
      'plugin::strapi-audio-broadcast.track',
      {
        _limit: -1,
        populate: [
          "audioFile"
        ]
      }
    );

    const queueSettings = await strapi.entityService.update(
      'plugin::strapi-audio-broadcast.queue-setting',
      1,
      {
        data: {
          isPlaying: false
        }
      }
    );
    
    strapi.queue.queue = queueSettings.queue || []

    // const queuedTracks = queueSettings.queue.map(id => tracks.find((track) => track.id === id))

    // if (queuedTracks.length) {
    //   setTimeout(async () => {
    //     await strapi.queue.loadTracksFromURLs(queuedTracks)
    //   }, 1000);
    // }
  },
  async update(data) {
    try {
      const queueSettings = await strapi.entityService.update(
        'plugin::strapi-audio-broadcast.queue-setting',
        data?.id,
        {
          data: {
            ...data
          }
        }
      );
  
      return queueSettings;
    } catch (error) {
      throw error  
    }
  },
  async play() {
    await strapi.entityService.update(
      'plugin::strapi-audio-broadcast.queue-setting',
      1,
      {
        data: {
          isPlaying: true
        }
      }
    );

    strapi.queue.play()

    return true
  },
  async pause() {
    await strapi.entityService.update(
      'plugin::strapi-audio-broadcast.queue-setting',
      1,
      {
        data: {
          isPlaying: false
        }
      }
    );

    strapi.queue.pause()

    return true
  },
  async getCurrentTrack() {
    const queueCurrentTrack = strapi.queue.currentTrack

    const ctx = strapi.requestContext.get()

    if (!queueCurrentTrack) return null

    const track = await strapi.entityService.findOne(
      'plugin::strapi-audio-broadcast.track',
      queueCurrentTrack.trackId,
      ctx.query
    );

    return track

  }
});
