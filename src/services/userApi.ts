import { spotifyApiClient } from "~/configs/axiosClient";

export const getUserData = async () => {
    const { data } = await spotifyApiClient.get(`me`);
    return data;
};

export const getUserPlaylist = async (id: string) => {
    const { data } = await spotifyApiClient.get(`users/${id}/playlists`, {
        params: {
            limit: 50,
        },
    });
    return data;
};

export const getMyPlaylist = async (id: string) => {
    const { data } = await spotifyApiClient.get(`me/playlists`);
    return data?.items?.filter((item: any) => item?.owner?.id === id);
};

export const getUserAlbum = async () => {
    const { data } = await spotifyApiClient.get("me/albums");
    return data;
};

export const getUserTopArtists = async () => {
    const { data } = await spotifyApiClient.get("me/top/artists", {
        params: {
            limit: 50,
        },
    });
    return data;
};

export const getArtistsUserFollowing = async () => {
    const { data } = await spotifyApiClient.get("me/following?type=artist");
    return data;
};
