// api.js

import { fileUploadRequestMutation, libraryTrackCreateMutation, libraryTrackQuery } from './graphqlQueries';

const music_url = 'https://api.cyanite.ai/graphql';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiSW50ZWdyYXRpb25BY2Nlc3NUb2tlbiIsInZlcnNpb24iOiIxLjAiLCJpbnRlZ3JhdGlvbklkIjoxMTYwLCJ1c2VySWQiOjEzNTg5MiwiYWNjZXNzVG9rZW5TZWNyZXQiOiJmMTAwM2VhODkyN2VlZmZlMDY1ZDgzNWNjYjc0OTZlYWE0YTMyYWE2NzJmZTcyNjY4M2VlZjY2ZTJlYjE0NzU3IiwiaWF0IjoxNzIyMzkzNDg4fQ.jpUVFnyb-GiB4xPmYFVHyjr87oQS09dg0x4L8-eRj2w';

export const fetchFileUploadRequest = async () => {
  const response = await fetch(music_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query: fileUploadRequestMutation }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }

  const responseData = await response.json();

  if (responseData.errors) {
    console.error('GraphQL errors:', responseData.errors);
    throw new Error('Error requesting file upload URL.');
  }

  return responseData.data.fileUploadRequest;
};

export const uploadFile = async (uploadUrl, file) => {
  const fileBody = await file.arrayBuffer(); // Read the file as an array buffer
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    body: fileBody,
    headers: {
      'Content-Type': 'audio/mpeg', // Assuming the file type is audio/mpeg, adjust if necessary
    },
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    throw new Error(`HTTP error! status: ${uploadResponse.status}, message: ${errorText}`);
  }

  return await uploadResponse.text();
};

export const createLibraryTrack = async (uploadId, title) => {
  const variables = {
    input: {
      uploadId,
      title,
    },
  };

  const response = await fetch(music_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query: libraryTrackCreateMutation, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }

  const responseData = await response.json();

  if (responseData.errors) {
    console.error('GraphQL errors:', responseData.errors);
    throw new Error('Error creating library track.');
  }

  return responseData.data.libraryTrackCreate;
};

export const fetchLibraryTrack = async (trackId) => {
  const variables = { id: trackId };

  const response = await fetch(music_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ query: libraryTrackQuery, variables }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }

  const responseData = await response.json();

  if (responseData.errors) {
    console.error('GraphQL errors:', responseData.errors);
    throw new Error('Error fetching library track.');
  }

  return responseData.data.libraryTrack;
};