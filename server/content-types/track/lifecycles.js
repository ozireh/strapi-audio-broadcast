module.exports = {
  afterUpdate: async () => {
    const settings = await strapi.entityService.findMany("plugin::strapi-audio-broadcast.queue-setting", {
      populate: [
        "nextTrack"
      ]
    })

    const tracks = await strapi
      .plugin('strapi-audio-broadcast')
      .service('track')
      .find()

    let tracksToLoad = []
    const queuedTracks = settings.queue.map(id => tracks.find((track) => track.id === id))

    queuedTracks.forEach(track => {
      if (!strapi?.queue?.tracks?.find((t) => t.id == track?.audioFile?.id && t.trackId == track?.id)) {
        tracksToLoad.push(track)
      }
    })

    if (tracksToLoad.length) {
      await new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            await strapi.queue.loadTracksFromURLs(tracksToLoad)
            resolve()
          } catch (error) {
            reject(error)
          }
        }, 1000);
      })
    } 

    // reorder strapi.queue.tracks based on settings.queue
    const reorderedTracks = strapi?.queue?.tracks
      ?.filter((track) => settings.queue.includes(track?.trackId))
      ?.sort((a, b) => {
        const aIndex = settings.queue.indexOf(a?.trackId)
        const bIndex = settings.queue.indexOf(b?.trackId)

        return aIndex - bIndex
      }
    )

    strapi.queue.tracks = reorderedTracks
  }
}