import { spotifyApiClient } from "~/configs/axiosClient";
import { countries } from "~/types/countries";

interface ShowApiProps {
    id?: string;
}

export const showApi = async (params: ShowApiProps) => {
    const { id } = params;

    const { data } = await spotifyApiClient.get(`shows/${id}`);
    console.log("Check data in showApi: ", data);

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

    console.log("Check data in showApi: ", data);

    return data;
};
