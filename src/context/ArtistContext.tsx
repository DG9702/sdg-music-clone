import artistApi, {getArtistTopTrack} from "~/services/artistApi";
import { ArtistProfile } from "~/types/artist";
import { SpotifyTrack } from "~/types/track";
import { FC, ReactNode, createContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ArtistModal from "~/components/ArtistModal";

interface ArtistProviderProps {
  children: ReactNode;
}

interface ArtistContext {
  profile: ArtistProfile;
  avatarImg?: string;
  headerImg?: string;
  colorRaw?: string;
  stats: {
    followerNumbers?: number;
    monthlyListeners?: number;
  };
  topTracks?: SpotifyTrack[];
  discography: {
    popularReleases?: any[];
    albums?: any[];
    singles?: any[];
  };
  playlists?: any[];
  featuring?: any[];
  relatedArtists?: any[];
  appearsOn?: any[];
  discoveredOn?: any[];
  aboutImg: string;
  setId: React.Dispatch<React.SetStateAction<string | undefined>>;
  isLoading: boolean;
  visuals: any;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ArtistContext = createContext({} as ArtistContext);

export const ArtistProvider: FC<ArtistProviderProps> = ({ children }) => {
  const [id, setId] = useState<string | undefined>("");
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<any>();
  const [artistData, setArtistData] = useState<any>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const regex = /^\/artist\//;
  const { pathname } = useLocation();
  const {id: artistId}=useParams();
  const [topTracksContext, setTopTracks]=useState<any>();

  useEffect(() => {
    if (regex.test(pathname)) {
      setId(artistId);
    }
    // } else if(pathname !== '/queue') {
    //   setId('')
    //   setArtistData(undefined)
    //   setResponseData(undefined)
    // }
  }, [pathname]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await artistApi(id);
      setResponseData(data);
    };
    if (id !== "") fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData=async () => {
      const data=await getArtistTopTrack(id);
      setTopTracks(data);
    }
    if(id!=="") fetchData();
  }, [id])

  useEffect(() => {
    setArtistData((prev: any) => {
      return {
        ...prev,
        profile: {
          id: responseData?.id,
          name: responseData?.profile?.name,
          bio: responseData?.profile?.biography?.text,
          isVerified: responseData?.profile?.verified,
          externalLinks: responseData?.profile?.externalLinks?.items,
        },
        headerImg: responseData?.visuals?.headerImage?.sources[0]?.url,
        avatarImg: responseData?.visuals?.avatarImage?.sources[0]?.url,
        colorRaw:
          responseData?.visuals?.headerImage?.extractedColors?.colorRaw.hex ||
          responseData?.visuals?.avatarImage?.extractedColors?.colorRaw?.hex,
        stats: {
          followerNumbers: responseData?.stats?.followers,
          monthlyListeners: responseData?.stats?.monthlyListeners,
        },
        topTracks: topTracksContext?.tracks?.map(
          (item: SpotifyTrack) => item,
        ),
        discography: {
          popularReleases: responseData?.discography?.popularReleases.items,
          albums: responseData?.discography?.albums.items,
          singles: responseData?.discography?.singles.items,
        },
        playlists: responseData?.profile?.playlists?.items,
        appearsOn: responseData?.relatedContent?.appearsOn?.items?.map(
          (item: any) => item?.releases?.items[0],
        ),
        featuring: responseData?.relatedContent?.featuring?.items,
        relatedArtists: responseData?.relatedContent?.relatedArtists?.items,
        discoveredOn: responseData?.relatedContent?.discoveredOn?.items,
        aboutImg: responseData?.visuals?.gallery?.items[0]?.sources[0]?.url,
        visuals: responseData?.visuals,
      };
    });
  }, [responseData]);

  useEffect(() => {
    setLoading(Boolean(!responseData));
  }, [responseData]);

  return (
    <ArtistContext.Provider
      value={{ ...artistData, setId, isLoading, setModalOpen }}
    >
      {children}
      {isModalOpen && (
        <ArtistModal
          profile={{ ...responseData?.profile, id: responseData?.id }}
          aboutImg={
            responseData?.visuals?.gallery?.items[0]?.sources[0]?.url ??
            responseData?.visuals?.avatarImage?.sources[0]?.url
          }
          stats={responseData?.stats}
          setModalOpen={setModalOpen}
        />
      )}
    </ArtistContext.Provider>
  );
};
