# Strapi Audio Broadcast Plugin

Strapi Audio Broadcast plugin allows you to broadcast music and stream audio tracks in your Strapi application. This plugin provides a seamless integration for managing and playing audio tracks within the Strapi Admin panel.

## Installation and usage

###### Note: This plugin is currently in an early development stage and is not considered stable. Use it at your own risk.

This installation method will soon be replaced by a more common approach. However, for the time being, you can follow these steps to temporarily test the Strapi Audio Broadcast plugin:

1. Install the package using Yarn or npm:

```sh
yarn add strapi-audio-broadcast@https://github.com/ozireh/strapi-audio-broadcast#main
```

or

```sh
npm install strapi-audio-broadcast@https://github.com/ozireh/strapi-audio-broadcast#main
```

2. Open the config/plugins.js file located in your Strapi project and add the plugin configuration to enable it and set the desired protocol:

```javascript
module.exports = ({ env }) => ({
  'strapi-audio-broadcast': {
    enabled: true,
    config: {
      protocol: env('PROTOCOL', 'http'),
    },
  },
});
```

3. Build the Strapi application:

```sh
yarn build
```

## Credits
-  Broadcast logic [https://github.com/WoolDoughnut310/radio-broadcast](https://github.com/WoolDoughnut310/radio-broadcast)