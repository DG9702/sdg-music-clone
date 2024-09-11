import { spotifyApiClient } from "~/configs/axiosClient";

interface EpisodeApiProps {
    id: string;
}

export const episodeApi = async (params: Partial<EpisodeApiProps>) => {
    const { id } = params;

    const { data } = await spotifyApiClient.get(`episodes/${id}`);

    return data;
};

export const checkUserSaveEpisode = async (params: any) => {
    const ids = params;
    const result = await spotifyApiClient.get("me/episodes/contains", {
        params: ids,
    });
    return result;
};

export const saveEpisodeForCurrentUser = async (params: any) => {
    const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    const result = await spotifyApiClient.put(`me/episodes?ids=${params}`, {
        headers: {
            Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
            "Content-type": "application/json",
        },
    });
    console.log(result);

    return result;
};

export const removeEpisodeForCurrentUser = async (params: any) => {
    const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    const result = await spotifyApiClient.delete(`me/episodes?ids=${params}`, {
        headers: {
            Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
            "Content-type": "application/json",
        },
    });
    console.log(result);

    return result;
};
