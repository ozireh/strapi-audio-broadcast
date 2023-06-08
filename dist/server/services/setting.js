'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  service
 */
const { createCoreService } = require('@strapi/strapi').factories;
exports.default = createCoreService('plugin::strapi-audio-broadcast.setting');
