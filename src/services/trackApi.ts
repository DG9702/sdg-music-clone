import { countries } from "~/types/countries";
import { spotifyApiClient } from "~/configs/axiosClient";

interface GetTrackParams {
  id: string;
}

export const getTrack = async (params: GetTrackParams) => {
  const { id } = params;

  const { data } = await spotifyApiClient.get(`tracks/${id}`);

  return data;
};

interface getTrackRecommendationParams {
  limit?: number;
  market?: countries;
  seed_artists: string;
  seed_tracks?: string;
}

export const getTrackRecommendation = async (
  params: getTrackRecommendationParams,
) => {
  const { limit = 10, market = "VN", seed_artists, seed_tracks } = params;
  const { data } = await spotifyApiClient.get("recommendations", {
    params: {
      limit,
      market,
      seed_artists,
      seed_tracks,
    },
  });

  return data.tracks;
};

interface getUserSaveParams {
  limit?: number;
  market?: countries;
  offset?: number;
}

export const checkUserSaveTrack = async (params: any) => {
  const ids = params;
  const result = await spotifyApiClient.get("me/tracks/contains", {
    params: ids,
  });
  return result;
};

export const getUserSaveTrack = async (params: getUserSaveParams) => {
  const { limit = 20, market = "VN", offset = 0 } = params;
  const { data } = await spotifyApiClient.get("me/tracks", {
    params: {
      limit,
      market,
      offset,
    },
  });

  return data;
};

export const saveTrackForCurrentUser = async (params: any) => {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

  const result = await spotifyApiClient.put(`me/tracks?ids=${params}`, {
    headers: {
      Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
      "Content-type": "application/json",
    },
  });
  return result;
};

export const removeTrackForCurrentUser = async (params: any) => {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

  const result = await spotifyApiClient.delete(`me/tracks?ids=${params}`, {
    headers: {
      Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
      "Content-type": "application/json",
    },
  });

  return result;
};
