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
  }
];
