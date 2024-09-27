import { spotifyApiClient } from "~/configs/axiosClient";

export const getCategories = async () => {
  const { data } = await spotifyApiClient.get("browse/categories", {
    params: {
      country: "VN",
      limit: 20,
    },
  });

  return data;
};

interface getCategoryPlaylistProps {
  id?: string;
  limit?: number;
  offset?: number;
}

export const getCategoryPlaylist = async (params: getCategoryPlaylistProps) => {
  const { id, limit = 20, offset = 0 } = params;
  if (!id) return;

  const { data } = await spotifyApiClient?.get(
    `browse/categories/${id}/playlists`,
    {
      params: {
        limit,
        country: "VN",
        offset,
      },
    },
  );

  return data;
};

export const getCategoryInfo = async (params: getCategoryPlaylistProps) => {
  const { id } = params;
  if (!id) return;

  const { data } = await spotifyApiClient.get(`browse/categories/${id}`);

  return data;
};
