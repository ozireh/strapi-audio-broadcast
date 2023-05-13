/**
 *  service
 */

module.exports = ({ strapi }) => ({
  async find() {
    const ctx = strapi.requestContext.get()
    const tracks = await strapi.entityService.findMany(
      'plugin::audio-broadcast.track',
      ctx.query
    );

    return tracks;
  }
});
