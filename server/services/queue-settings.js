'use strict';
const Queue = require('../../admin/src/utils/queue')

module.exports = ({ strapi }) => ({
  async find() {
    try {
      const queueSettings = await strapi.entityService.findMany(
        'plugin::strapi-audio-broadcast.queue-setting',
        {
          populate: [
            "nextTrack"
          ]
        }
      );
  
      return queueSettings;
    } catch (error) {
      throw error  
    }
  },
  async init() {
    try {
      const protocol = strapi.config.get('plugin.strapi-audio-broadcast')?.protocol
  
      if (protocol !== 'http' && protocol !== 'https') {
        throw new Error('Invalid protocol')
      }
  
      strapi.queue = new Queue({
        protocol: strapi.config.get('plugin.protocol'),
        host: strapi.config.get('server.host'),
        port: strapi.config.get('server.port'),
      })
  
      strapi.queue.onGetNextTrack(async () => {
        strapi.entityService.update(
          'plugin::strapi-audio-broadcast.queue-setting',
          1,
          {
            data: {
              nextTrack: null
            }
          }
        );
      })
  
      const queueSettings = await strapi.entityService.update(
        'plugin::strapi-audio-broadcast.queue-setting',
        1,
        {
          data: {
            isPlaying: false,
            queue: [],
          }
        }
      );

      if (!queueSettings) {
        await strapi.entityService.create(
          'plugin::strapi-audio-broadcast.queue-setting',
          {
            data: {
              id: 1,
              isPlaying: false,
              queue: [],
            }
          })
      }
      
      strapi.queue.queue = queueSettings?.queue || []

    } catch (error) {
      throw error
    }
  },
  async update(data) {
    try {
      const queueSettings = await strapi.entityService.update(
        'plugin::strapi-audio-broadcast.queue-setting',
        1,
        {
          populate: [
            "nextTrack"
          ],
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
  },
  async getPublicCurrentTrack() {
    const queueCurrentTrack = strapi.queue.currentTrack

    if (!queueCurrentTrack) return null

    const track = await strapi.entityService.findOne(
      'plugin::strapi-audio-broadcast.track',
      queueCurrentTrack.trackId,
      {
        populate: [
          "coverImage",
        ]
      }
    );

    return track
  }
});
