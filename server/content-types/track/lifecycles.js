module.exports = {
  // afterCreate: async (event) => {
  //   console.log("afterCreate", event);

  //   const track = event?.result;
  //   await strapi?.queue?.loadTracksFromURLs([track])

  //   console.log("new track loaded !!");

  // },
  // afterUpdate: async (event) => {
  //   console.log("afterUpdate");

  //   const track = event?.result;

  //   // track.audioFile?.id
  //   if (!strapi?.queue?.tracks?.find((t) => t.id === track?.audioFile?.id)) {
  //     await strapi?.queue?.loadTracksFromURLs([track])
  //   }
    
  //   console.log("new track loaded !!");
  // }
}