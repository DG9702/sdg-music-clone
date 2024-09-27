import { spotifyApiClient } from "~/configs/axiosClient";
import { UserData } from "~/types/user";

export const checkCurrentUserFollowPlaylist = async (
  playlist_id: any,
  params?: any,
) => {
  const ids = params;
  const result = await spotifyApiClient.get(
    `playlists/${playlist_id}/followers/contains`,
    {
      params: ids,
    },
  );
  return result;
};

export const followPlaylistForCurrentUser = async (playlist_id: any) => {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

  const result = await spotifyApiClient.put(
    `playlists/${playlist_id}/followers`,
    {
      body: {
        public: false,
      },
      headers: {
        Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
        "Content-type": "application/json",
      },
    },
  );
  return result;
};

export const unFollowPlaylistForCurrentUser = async (playlist_id: any) => {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

  const result = await spotifyApiClient.delete(
    `playlists/${playlist_id}/followers`,
    {
      headers: {
        Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
        "Content-type": "application/json",
      },
    },
  );
  return result;
};

export interface Playlist {
  collaborative: boolean;
  description: string | null;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  followers: {
    href: string;
    total: number;
  };
  name: string;
  owner: UserData | null;
  public: boolean | null;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  } | null;
  type: "playlist";
  uri: string;
}

export const createPlaylist = async (
  userId: string | undefined,
  data: {
    name: string;
    public?: boolean;
    collaborative?: boolean;
    description?: string;
  },
) => {
  const result = await spotifyApiClient.post<Playlist>(
    `users/${userId}/playlists`,
    data,
  );
  return result;
};

export const addItemToPlaylist = async (
  playlistId: string,
  uris: string[],
  snapshot_id: string,
) => {
  const result = await spotifyApiClient.post(`playlists/${playlistId}/tracks`, {
    uris,
    snapshot_id,
  });
  return result;
};

export const changePlaylistDetails = async (
  playlistId: any,
  data: {
    name?: string;
    public?: boolean;
    collaborative?: boolean;
    description?: string;
  },
) => {
  return spotifyApiClient.put(`/playlists/${playlistId}`, data);
};

export const changePlaylistImage = async (
  playlistId: any,
  image: string,
  content: string,
) => {
  return spotifyApiClient.put(`/playlists/${playlistId}/images`, image, {
    headers: { "Content-Type": content },
  });
};

export const removePlaylistItems = async (
  playlistId: string,
  uris: string[],
  snapshot_id: string,
) => {
  return spotifyApiClient.delete(`/playlists/${playlistId}/tracks`, {
    data: {
      tracks: uris.map((uri) => ({ uri })),
      snapshot_id,
    },
  });
};
