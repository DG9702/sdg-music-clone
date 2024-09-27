import { spotifyApiClient } from "~/configs/axiosClient";

export const checkCurrentUserSaveAlbum = async (params: any) => {
  const ids = params;
  const result = await spotifyApiClient.get("me/albums/contains", {
    params: ids,
  });
  return result;
};

export const followAlbumForCurrentUser = async (params: any) => {
  const result = await spotifyApiClient.put(`me/albums?ids=${params}`);
  return result;
};

export const unFollowAlbumForCurrentUser = async (params: any) => {
  const result = await spotifyApiClient.delete(`me/albums?ids=${params}`);
  return result;
};
