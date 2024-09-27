import { spotifyApiClient } from "~/configs/axiosClient";
import { countries } from "~/types/countries";

interface ShowApiProps {
  id?: string;
}

export const showApi = async (params: ShowApiProps) => {
  const { id } = params;

  const { data } = await spotifyApiClient.get(`shows/${id}`);

  return data;
};

interface getUserSaveParams {
  limit?: number;
  market?: countries;
  offset?: number;
}

export const getUserEpisodeSaveApi = async (params: getUserSaveParams) => {
  const { limit = 50, market = "VN", offset = 0 } = params;
  const { data } = await spotifyApiClient.get("me/episodes", {
    params: {
      limit,
      market,
      offset,
    },
  });

  return data;
};

export const checkCurrentUserFollowShows = async (params?: any) => {
  const { ids } = params;
  const result = await spotifyApiClient.get("me/shows/contains", {
    params: {
      ids,
    },
  });
  return result;
};

export const followShowForCurrentUser = async (params: any) => {
  const { ids } = params;

  const result = await spotifyApiClient.put(`me/shows?ids=${ids}`);

  return result;
};

export const unFollowShowForCurrentUser = async (params: any) => {
  const { market = "", ids } = params;

  const result = await spotifyApiClient.delete(
    `me/following?ids=${ids}&market=${market}`,
  );
  return result;
};
