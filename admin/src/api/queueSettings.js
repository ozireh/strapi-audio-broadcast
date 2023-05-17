import axiosInstance from "../utils/axiosInstance";

const queueSettingsRequests = {
  getSettings: async () => {
    return await axiosInstance.get('/strapi-audio-broadcast/queue-setting')
  },
  updateSettings: async (settings) => {
    return await axiosInstance.put('/strapi-audio-broadcast/queue-setting', settings)
  },
  play: async () => {
    return await axiosInstance.get('/strapi-audio-broadcast/queue-setting/play')
  },
  pause: async () => {
    return await axiosInstance.get('/strapi-audio-broadcast/queue-setting/pause')
  },
  getCurrentTrack: async () => {
    return await axiosInstance.get('/strapi-audio-broadcast/queue-setting/current-track')
  }
};

export default queueSettingsRequests;