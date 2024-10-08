import browserApi from "~/services/browserApi";
import { getCategoryPlaylist } from "~/services/categoriesApi";
import searchApi from "~/services/searchApi";
import { SectionProps } from "~/types/section";

interface PropsType {
  type:
    | "newRelease"
    | "featuredPlaylists"
    | "topMixes"
    | "suggestedArtists"
    | "category";
  setData: React.Dispatch<React.SetStateAction<SectionProps | undefined>>;
  limit?: number;
  categoryId?: string;
  categoryName?: string;
}

const fetchHomePageData = (params: Partial<PropsType>) => {
  const { type, setData, limit = 20, categoryId, categoryName } = params;

  if (type === "category") {
    const fetchData = async () => {
      const data = await getCategoryPlaylist({ id: categoryId, limit: 10 });
      const dataNormalized = data?.playlists?.items?.filter(
        (item: any) => item,
      );
      setData!({
        title: categoryName,
        href: `/genre/${categoryId}`,
        apiType: "spotify",
        data: dataNormalized,
        dataType: "playlist",
      });
    };
    fetchData();
    return;
  }

  switch (type) {
    case "newRelease": {
      const fetchData = async () => {
        const response = await browserApi({
          limit: limit,
          country: "VN",
          type: "new-releases",
        });
        setData!({
          title: "New Releases",
          href: "/section/newReleases",
          dataType: "album",
          data: response,
          apiType: "spotify",
        });
      };
      fetchData();
      break;
    }

    case "featuredPlaylists": {
      const fetchData = async () => {
        const response = await browserApi({
          limit: limit,
          country: "VN",
          type: "featured-playlists",
        });
        setData!({
          title: "Featured Playlists",
          href: "/section/featurePlaylist",
          dataType: "playlist",
          data: response,
          apiType: "spotify",
        });
      };
      fetchData();
      break;
    }

    case "topMixes": {
      const fetchData = async () => {
        const response = await searchApi({
          query: "chill mix lofi",
          types: ["playlist"],
          limit: limit,
        });
        setData!({
          title: "Top mixes",
          href: "/section/topMixes",
          dataType: "playlist",
          data: response?.playlists.items,
          apiType: "spotify",
        });
      };
      fetchData();
      break;
    }

    case "suggestedArtists": {
      const fetchData = async () => {
        const response = await searchApi({
          query: "artist",
          types: ["artist"],
          limit: limit,
        });
        setData!({
          title: "Suggested artists",
          href: "/section/suggestedArtists",
          dataType: "artist",
          data: response?.artists.items
            .sort((a: any, b: any) => -a.popularity + b.popularity)
            .filter((artist: any) => artist.images.length !== 0),
          apiType: "spotify",
        });
      };
      fetchData();
      break;
    }
  }
};

export default fetchHomePageData;
