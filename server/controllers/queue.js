'use strict';

module.exports = ({ strapi }) => ({
  stream(ctx) {
    ctx.body = strapi
      .plugin('audio-broadcast')
      .service('queue')
      .stream()
  },
});
