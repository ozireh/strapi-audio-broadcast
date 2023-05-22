# Strapi Audio Broadcast Plugin

Strapi Audio Broadcast plugin allows you to broadcast music and stream audio tracks in your Strapi application. This plugin provides a seamless integration for managing and playing audio tracks within the Strapi Admin panel.

## Installation

###### Note: This plugin is currently in an early development stage and is not considered stable. Use it at your own risk.

This installation method will soon be replaced by a more common approach. However, for the time being, you can follow these steps to temporarily test the Strapi Audio Broadcast plugin:

1. Install the package using Yarn or npm:

```sh
yarn add strapi-audio-broadcast@https://github.com/ozireh/strapi-audio-broadcast#0.1.0-alpha.1
```

or

```sh
npm install strapi-audio-broadcast@https://github.com/ozireh/strapi-audio-broadcast#0.1.0-alpha.1
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

## Usage

After installing and configuring the Strapi Audio Broadcast plugin, you can start using it in the Strapi Admin panel.

1. Access the Content Manager in the Strapi Admin panel.


2. You will find a new collection type called "Track". Use this collection to add and upload audio tracks that you want to broadcast.

<img width="1437" alt="Capture d’écran 2023-05-18 à 21 52 00" src="https://github.com/ozireh/strapi-audio-broadcast/assets/34472082/98c1d38b-0ff5-4594-bd39-03361bed9ac1">


3. Navigate to the "Audio Broadcast" menu item in the Admin panel. Here, you can configure the order of the played tracks and control the audio stream.

<img width="1438" alt="Capture d’écran 2023-05-18 à 22 19 24" src="https://github.com/ozireh/strapi-audio-broadcast/assets/34472082/5364e6f2-9286-4a82-a70b-ef84ad267a1f">


4. To start the audio stream, use the following URL: [http://localhost:1337/strapi-audio-broadcast/stream](http://localhost:1337/strapi-audio-broadcast/stream)


5. You can play or stop the audio stream using the controls provided in the "Audio Broadcast" menu.

## Credits
-  Broadcast logic [https://github.com/WoolDoughnut310/radio-broadcast](https://github.com/WoolDoughnut310/radio-broadcast)