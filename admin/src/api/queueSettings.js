import axiosInstance from "../utils/axiosInstance";

const queueSettingsRequests = {
  getSettings: async () => {
    const data = await axiosInstance.get('/strapi-audio-broadcast/queue-setting')
    console.log(data);
    return data
  },
};

export default queueSettingsRequests;