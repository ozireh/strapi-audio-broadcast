'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  router
 */
const { createCoreRouter } = require('@strapi/strapi').factories;
exports.default = createCoreRouter('plugin::strapi-audio-broadcast.track');
