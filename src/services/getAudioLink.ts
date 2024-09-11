import axios from "axios";

interface GetAudioLinkParams {
  query: string;
  duration_ms: number;
  name: string;
}

//export const getYoutubeAudioId = async (paramsSearch: GetAudioLinkParams) => {
//  const { type, query, duration_ms } = paramsSearch;
//  const url =
//    type === "track"
//      ? "https://fastytapi.p.rapidapi.com/ytapi/search"
//      : "https://yt-api.p.rapidapi.com/search";
//  const params =
//    type === "track"
//      ? {
//          query: `${query}`,
//          resultsType: "video",
//          sortBy: "relevance",
//          geo: "GB",
//        }
//      : {
//          query: query,
//          sort_by: "relevance",
//        };

//  const apiKey =
//    type === "track"
//      ? import.meta.env.VITE_RAPID_SPOTIFY_API_KEY
//      : import.meta.env.VITE_RAPID_YOUTUBE_SEARCH_PODCAST_AND_AUDIO;
//  const rapidHost =
//    type === "track" ? "fastytapi.p.rapidapi.com" : "yt-api.p.rapidapi.com";

//  const option = {
//    method: "GET",
//    url,
//    params,
//    headers: {
//      "X-RapidAPI-Key": apiKey,
//      "X-RapidAPI-Host": rapidHost,
//    },
//  };

//  const { data } = await axios.request(option);

//  if (type === "show") return data.data[0].videoId;

//  for (const item of data.data) {
//    const diff = Math.abs(item.lengthSeconds - duration_ms / 1000);
//    if (diff < 80) {
//      return item.videoId;
//    }
//  }

//  return data.data[0].videoId;
//};

const formatDuration = (durationMs: number, type: string) => {
  const duration = Math.ceil(durationMs / 1000); // Chuyển đổi mili giây thành giây

  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  const formattedMinutes = minutes.toString();
  const formattedSeconds = seconds.toString().padStart(1, "0");

  if (duration < 10) {
    return type === "chữ"
      ? `${formattedSeconds} giây`
      : `00:${formattedSeconds}`;
  } else if (duration >= 10 && duration < 60) {
    return type === "chữ"
      ? `${formattedSeconds} giây`
      : `00:${formattedSeconds}`;
  } else if (duration >= 60 && duration < 600) {
    return type === "chữ"
      ? `${formattedMinutes} phút`
      : `0${formattedMinutes}:${formattedSeconds}`;
  } else if (duration >= 600 && duration < 3600) {
    return type === "chữ"
      ? `${formattedMinutes} phút`
      : `${formattedMinutes}:${formattedSeconds}`;
  } else {
    const hours = Math.floor(duration / 3600);
    const formattedHours = hours.toString().padStart(2, "0");
    return type === "chữ"
      ? `${formattedHours} giờ ${formattedMinutes} phút ${formattedSeconds} giây`
      : `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
};

export const getYoutubeAudioId = async (paramsSearch: GetAudioLinkParams) => {
  const { query, duration_ms, name } = paramsSearch;

  let ids = "";

  const url = "https://yt-api.p.rapidapi.com/search";
  const params = {
    query: query,
    geo: "GB",
    sort_by: "relevance",
  };

  const apiKey = import.meta.env.VITE_RAPID_YOUTUBE_SEARCH_PODCAST_AND_AUDIO;
  const rapidHost = "yt-api.p.rapidapi.com";

  const option = {
    method: "GET",
    url,
    params,
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": rapidHost,
    },
  };

  const { data } = await axios.request(option);
  //console.log("Check data in audio link: ", data);

  console.log("Check duration_ms: ", formatDuration(174857, "số"));

  //if (type === "show") return data.data[0].videoId;

  data?.data?.map((item: any, index: any) => {
    if (item.title === name) {
      ids = item?.videoId;
      console.log("Check item: ", ids);
    }
  });

  return ids;
};

export const getAudioLink = async (params: GetAudioLinkParams) => {
  const { query } = params;
  console.log(query);
  const id = await getYoutubeAudioId(params);
  console.log(id);
  const options = {
    method: "GET",
    url: "https://yt-api.p.rapidapi.com/dl",
    params: { id },
    headers: {
      "X-RapidAPI-Key": import.meta.env
        .VITE_RAPID_YOUTUBE_SEARCH_PODCAST_AND_AUDIO,
      "X-RapidAPI-Host": "ytstream-download-youtube-videos.p.rapidapi.com",
    },
  };
  const { data } = await axios.request(options);
  const returnData = data.adaptiveFormats
    .filter((item: any) => item.mimeType.includes("audio"))
    .sort((a: any, b: any) => -a.bitrate + b.bitrate)[0];

  return {
    audioLink: returnData.url,
    durationMs: Number(returnData.approxDurationMs),
  };
};

// export const getAudioLink = async (params: GetAudioLinkParams) => {
//   const { query } = params
//   console.log(query)
//   const id = await getYoutubeAudioId(params)
//   console.log(id)
//   const options = {
//     method: 'GET',
//     url: 'https://yt-api.p.rapidapi.com/dl',
//     params: { id },
//     headers: {
//       'X-RapidAPI-Key': import.meta.env.VITE_RAPID_YOUTUBE_SEARCH_PODCAST_AND_AUDIO,
//       'X-RapidAPI-Host': 'ytstream-download-youtube-videos.p.rapidapi.com',
//     },
//   }
//   const { data } = await axios.request(options)
//   const returnData = data.adaptiveFormats
//   .filter((item: any) => item.mimeType.includes('audio'))
//   .sort((a: any, b: any) => -a.bitrate + b.bitrate)[0]
//   await fetch(`http://localhost:3000/audio-link?id=${id}`, { method: 'GET' })

//   return {
//     audioLink: `http://localhost:3000/audio/${id}`,
//     durationMs: Number(returnData.approxDurationMs),
//   }
// }
