import { countries } from "~/types/countries";
import { spotifyApiClient, spotifyApiDev } from "~/configs/axiosClient";

interface browserApiProps {
  limit: number;
  country: countries;
  type: "featured-playlists" | "new-releases";
}

const recentlyApi = async (params: Partial<browserApiProps>) => {
  const { limit } = params;

  const { data } = await spotifyApiClient.get(`me/player/recently-played`, {
    params: {
      limit: limit,
    },
  });

  return data;
};

export default recentlyApi;
