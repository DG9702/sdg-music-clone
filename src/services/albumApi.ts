import { spotifyApiDev } from "~/configs/axiosClient";

export const checkCurrentUserSaveAlbum = async (params: any) => {
    const ids = params;
    const result = await spotifyApiDev.get("me/albums/contains", {
        params: ids,
    });
    return result;
};

export const saveAlbumForCurrentUser = async (params: any) => {
    const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    const result = await spotifyApiDev.put(`me/albums?ids=${params}`, {
        headers: {
            Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
            "Content-type": "application/json",
        },
    });
    console.log(result);

    return result;
};

export const removeAlbumForCurrentUser = async (params: any) => {
    const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    const result = await spotifyApiDev.delete(`me/albums?ids=${params}`, {
        headers: {
            Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
            "Content-type": "application/json",
        },
    });
    console.log(result);

    return result;
};