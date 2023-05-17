module.exports = [
  {
    method: 'GET',
    path: '/stream',
    handler: 'queue.stream',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/tracks',
    handler: 'track.find',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/queue-setting',
    handler: 'queue-settings.find',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'PUT',
    path: '/queue-setting',
    handler: 'queue-settings.update',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/queue-setting/play',
    handler: 'queue-settings.play',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/queue-setting/pause',
    handler: 'queue-settings.pause',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/queue-setting/current-track',
    handler: 'queue-settings.getCurrentTrack',
    config: {
      policies: [],
      auth: false,
    },
  }
];
