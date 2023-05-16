'use strict';

module.exports = async ({ strapi }) => {
  // bootstrap phase
  strapi
    .plugin('strapi-audio-broadcast')
    .service('queue-settings')
    .init()

  // strapi.queue = new Queue(strapi);

  // const tracks = await strapi.entityService.findMany("plugin::strapi-audio-broadcast.track", {
  //   _limit: -1,
  //   populate: [
  //     "audioFile"
  //   ]
  // })

  // // console.log(tracks);

  // setTimeout(async () => {
  //   await strapi.queue.loadTracksFromURLs(tracks)
  //   strapi.queue.play()
  // }, 5000);
};
