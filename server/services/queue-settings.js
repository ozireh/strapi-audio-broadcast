'use strict';

module.exports = ({ strapi }) => ({
  async find() {
    try {
      const ctx = strapi.requestContext.get()
  
      const queueSettings = await strapi.entityService.findOne(
        'plugin::audio-broadcast.queue-setting',
        {
          ...ctx.query,
        }
      );
  
      return queueSettings;
    } catch (error) {
      throw error  
    }
  },
});
