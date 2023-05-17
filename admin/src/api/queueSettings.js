import axiosInstance from "../utils/axiosInstance";

const queueSettingsRequests = {
  getSettings: async () => {
    const data = await axiosInstance.get('/strapi-audio-broadcast/queue-setting')
    console.log(data);
    return data
  },
  updateSettings: async (settings) => {
    const data = await axiosInstance.put('/strapi-audio-broadcast/queue-setting', settings)
    console.log(data);
    return data
  },
  play: async () => {
    const data = await axiosInstance.get('/strapi-audio-broadcast/queue-setting/play')
    console.log(data);
    return data
  },
  pause: async () => {
    const data = await axiosInstance.get('/strapi-audio-broadcast/queue-setting/pause')
    console.log(data);
    return data
  }
};

export default queueSettingsRequests;