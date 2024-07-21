// utils/thetaUtils.js
import { ThetaVideoAPI } from '@thetalabs/theta-video-api';

const videoAPI = new ThetaVideoAPI('YOUR_API_KEY');

export async function uploadToThetaVideo(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await videoAPI.videos.upload(formData);
  return response.id;
}

export async function getVideoPlaybackUrl(videoId) {
  const video = await videoAPI.videos.get(videoId);
  return video.playback_url;
}