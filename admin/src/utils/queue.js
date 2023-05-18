const { v4: uuid } = require("uuid")
const { readdir } = require("fs/promises")
const { extname, join } = require("path")
const { PassThrough } = require("stream")
const { ffprobe } = require("@dropb/ffprobe")
const http = require("http")
const ffprobeStatic = require("ffprobe-static")
const Throttle = require("throttle")

ffprobe.path = ffprobeStatic.path

class Queue {
  constructor({
    protocol = "http",
    host = "localhost",
    port = 1337,
  }) {
    this.index = 0
    this.tracks = []
    this.queue = []
    this.clients = new Map()
    this.nextTrackId = null
    this.currentTrack = null
    this.stream = null
    this.playing = false
    this.throttle = null

    this.protocol = protocol
    this.host = host
    this.port = port

    this.onNextTrackCallbacks = []
  }

  onGetNextTrack(callback) {
    this.onNextTrackCallbacks.push(callback)
  }

  broadcast(chunk) {
    this.clients.forEach((client) => {
      client.write(chunk)
    })
  }

  addClient() {
    const id = uuid()
    const client = new PassThrough()

    this.clients.set(id, client)

    console.log(`Client ${id} connected`)
    
    return {
      id,
      client
    }
  }

  removeClient(id) {
    this.clients.delete(id)
  }

  async loadTracks(dir) {
    let filenames = await readdir(dir)
    
    filenames = filenames?.filter((filename) => extname(filename) === ".mp3")
    
    const filepaths = filenames.map((filename) => join(dir, filename))

    const tracks = filepaths.map(async (filepath) => {
      const bitrate = await this.getTrackBitrate(filepath)
      return {
        filepath,
        bitrate
      }
    })

    this.tracks = await Promise.all(tracks)
    
    console.log(`Loaded ${this.tracks.length} tracks`)
  }

  async loadTracksFromURLs(files) {
    const tracks = files.map(async (file) => {
      const url = `${this.protocol}://${this.host}:${this.port}${file?.audioFile?.url}`
      const bitrate = await this.getTrackBitrate(url)
      return {
        trackId: file?.id,
        id: file?.audioFile?.id,
        url: url,
        bitrate
      }
    })

    this.tracks.push(...await Promise.all(tracks))

    console.log(`Loaded ${this.tracks.length} tracks`)
  }

  async getTrackBitrate(url) {
    const { streams } = await ffprobe(url)
    const bitrate = streams?.[0]?.bit_rate

    return bitrate
      ? parseInt(bitrate) 
      : 128000
  }

  getNextTrack() {
    const currentQueueIndex = this.queue.findIndex((id) => id === this.currentTrack?.trackId) || 0
    const nextQueueIndex = currentQueueIndex + 1

    if (this.nextTrackId) {
      this.index = this.tracks.findIndex((track) => track.trackId === this.nextTrackId)
      this.nextTrackId = null
    } else if (!nextQueueIndex || nextQueueIndex >= this.queue.length) {
      this.index = 0
    } else {
      this.index = nextQueueIndex
    }

    const track = this.tracks.find((track) => track.trackId === this.queue[this.index])

    console.log("choices", this.tracks.map((track) => track.url));
    console.log(`Playing track number ${this.index}: ${track.url}`)
    
    this.currentTrack = track

    this.onNextTrackCallbacks.forEach(callback => {
      callback()
    })

    return track
  }

  async loadTrackStream() {
    const track = this.currentTrack
    if (!track) return

    this.stream = await new Promise((resolve) => {
      http.get(track.url, (res) => {
        resolve(res);
      })
    })

    console.log("Starting audio stream")
  }

  async start() {
    const track = this.currentTrack
    if (!track) return

    this.playing = true
    this.throttle = new Throttle(track.bitrate / 8)

    this.stream
      .pipe(this.throttle)
      .on("data", (chunk) => this.broadcast(chunk))
      .on("end", () => this.play(true))
      .on("error", () => this.play(true))
  }

  pause() {
    if (!this.started() || !this.playing) return
    this.playing = false
    
    console.log("Paused")
    
    this.throttle.removeAllListeners("end")
    this.throttle.end()
  }

  started() {
    return this.stream
      && this.throttle
      && this.currentTrack
  }

  resume() {
    if (!this.started() || this.playing) return
    
    console.log("Resumed")
    
    this.start()
  }

  async play(useNewTrack = false) {
    if (this.tracks?.length && (useNewTrack || !this.currentTrack)) {
      console.log("Playing new track")

      this.getNextTrack()
      await this.loadTrackStream()
      this.start()
    } else {
      this.resume()
    }
  }
}

module.exports = Queue