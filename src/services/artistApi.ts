import { rapidApiClient, spotifyApiClient } from "~/configs/axiosClient";

const artistApi = async (id?: string) => {
    if (!id) return;
    const { data } = await rapidApiClient.get("artist_overview/", {
        params: {
            id: id,
        },
    });

    return data.data.artist;
};

export const getArtistTopTrack = async (id?: string) => {
    if (!id) return;
    const { data } = await spotifyApiClient.get(
        `artists/${id}/top-tracks?market=VN`,
    );
    return data;
};

export const getArtistAlbums = async (id?: string) => {
    if (!id) return;
    const { data } = await spotifyApiClient.get(`artists/${id}/albums`);
    return data;
};

export const checkCurrentUserFollowArtists = async (params?: any) => {
    const { type = "artist", ids } = params;
    const result = await spotifyApiClient.get("me/following/contains", {
        params: {
            type,
            ids,
        },
    });
    return result;
};

export const followArtistForCurrentUser = async (params: any) => {
    const { type = "artist", ids } = params;
    const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    const result = await spotifyApiClient.put(`me/following`, {
        params: {
            type,
            ids,
        },
        body: {
            ids: ["string"],
        },
        headers: {
            Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
            "Content-type": "application/json",
        },
    });
    console.log(result);

    return result;
};

export const unFollowArtistForCurrentUser = async (params: any) => {
    const { type = "artist", ids } = params;
    const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    const result = await spotifyApiClient.delete(`me/following`, {
        params: {
            type,
            ids,
        },
        headers: {
            Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
            "Content-type": "application/json",
        },
    });
    console.log(result);

    return result;
};

export default artistApi;
