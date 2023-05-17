'use strict';

module.exports = ({ strapi }) => ({
  async find(ctx) {
    ctx.body = await strapi
      .plugin('strapi-audio-broadcast')
      .service('queue-settings')
      .find()
  },
  async update(ctx) {
    ctx.body = await strapi
      .plugin('strapi-audio-broadcast')
      .service('queue-settings')
      .update(ctx.request.body)
  },
  async play(ctx) {
    ctx.body = await strapi
      .plugin('strapi-audio-broadcast')
      .service('queue-settings')
      .play()
  },
  async pause(ctx) {
    ctx.body = await strapi
      .plugin('strapi-audio-broadcast')
      .service('queue-settings')
      .pause()
  },
  async getCurrentTrack(ctx) {
    ctx.body = await strapi
      .plugin('strapi-audio-broadcast')
      .service('queue-settings')
      .getCurrentTrack()
  }
});
