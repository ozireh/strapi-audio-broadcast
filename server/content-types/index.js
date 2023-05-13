'use strict';

const track = require('./track');
const queueSetting = require('./queue-setting');
module.exports = {
  track,
  'queue-setting': queueSetting,
}