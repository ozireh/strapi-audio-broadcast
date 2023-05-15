'use strict';

module.exports = ({ strapi }) => ({
  async find(ctx) {
    ctx.body = await strapi
      .plugin('strapi-audio-broadcast')
      .service('queue-settings')
      .find()
  },
});
