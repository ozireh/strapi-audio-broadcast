'use strict'

module.exports = ({ strapi }) => ({
  async find(ctx) {
    try {
      ctx.body = await strapi 
        .plugin('strapi-audio-broadcast')
        .service('track')
        .find()
    } catch (error) {
      throw error
    }
  }
});