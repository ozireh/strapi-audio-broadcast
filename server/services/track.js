/**
 *  service
 */

module.exports = ({ strapi }) => ({
  async find() {
    const tracks = await strapi.entityService.findMany(
      'plugin::strapi-audio-broadcast.track',
      {
        populate: [
          "audioFile"
        ]
      }
    );

    return tracks;
  },
});
