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
    strapi.queue = new Queue(strapi)
    const ctx = strapi.requestContext.get()
    const tracks = await strapi.entityService.findMany(
      'plugin::strapi-audio-broadcast.track',
      {
        _limit: -1,
        populate: [
          "audioFile"
        ]
      }
    );

    if (tracks.length) {
      await strapi.queue.loadTracksFromURLs(tracks)
      // strapi.queue.play()
    }
  },
});
