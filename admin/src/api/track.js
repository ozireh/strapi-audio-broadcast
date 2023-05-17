import axiosInstance from "../utils/axiosInstance";

const trackRequests = {
  getTracks: async () => {
    const data = await axiosInstance.get('/strapi-audio-broadcast/tracks')
    return data
  },
};

export default trackRequests;