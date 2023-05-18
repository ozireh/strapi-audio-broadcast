'use strict';

module.exports = async ({ strapi }) => {
  // bootstrap phase
  strapi
    .plugin('strapi-audio-broadcast')
    .service('queue-settings')
    .init()
};
