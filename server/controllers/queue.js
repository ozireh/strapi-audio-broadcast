'use strict';

module.exports = ({ strapi }) => ({
  stream(ctx) {
    ctx.body = strapi
      .plugin('strapi-audio-broadcast')
      .service('queue')
      .stream()
  },
});
