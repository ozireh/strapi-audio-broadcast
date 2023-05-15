'use strict';

const Queue = require('./lib/queue');

module.exports = async ({ strapi }) => {
  // bootstrap phase
  strapi.queue = new Queue(strapi);

  const tracks = await strapi.entityService.findMany("plugin::strapi-audio-broadcast.track", {
    _limit: -1,
    populate: [
      "coverImage",
      "audioFile",
    ]
  })

  // console.log(tracks);

  setTimeout(async () => {
    await strapi.queue.loadTracksFromURLs(tracks)
    strapi.queue.play()
  }, 5000);
};
