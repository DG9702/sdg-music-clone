import { SpotifyAlbum } from "./album";
import { ArtistData } from "./artist";
import { ImageSource } from "./others";

export interface SongItemTagProps {
    thumbnailUrl?: string;
    name?: string;
    isLoading?: boolean;
    id?: string;
    setBgColor: React.Dispatch<React.SetStateAction<string>>;
    albumId?: string;
}

export interface SongItemProps {
    songName?: string;
    artists?: ArtistData[];
    thumb?: string;
    duration?: number;
    order?: number;
    view?: any;
    isLoading?: boolean;
    albumData?: SpotifyAlbum;
    dateAdd?: string;
    AddBy?: string;
    isExplicit?: boolean;
    type?: "default" | "playlist" | "album" | "search" | "artist" | "queue";
    id?: string;
    originalData?: SpotifyTrack;
    isPlaying?: boolean;
    myPlaylist?: any;
    playlist?: any;
    setPlaylist?: any;
}

export interface SongListProps {
    songList?: SongItemProps[] | { track?: SpotifyTrack }[];
    setData?: any;
    playlist?: any;
    pivotTop?: number;
    top?: number;
    view?: any;
    isLoading?: boolean;
    type?: "default" | "playlist" | "album" | "search" | "artist" | "queue";
    albumId?: string;
    albumImages?: ImageSource[];
    inclHeader?: boolean;
    albumName?: string;
    albumType?:
        | "album"
        | "Playlist"
        | "single"
        | "compilation"
        | "podcast"
        | "episode"
        | undefined;
    adjustOrder?: number;
}

export interface SpotifyTrack {
    album?: SpotifyAlbum;
    artists?: ArtistData[];
    explicit?: boolean;
    duration_ms?: number;
    name?: string;
    id?: string;
    popularity?: number;
    preview_url?: any;
}

// -----------Rapid----------

export interface RapidTrack {
    soundcloudTrack?: {
        audio?: {
            quality?: string;
            url?: string;
            durationMs?: number;
            durationText?: string;
        }[];
    };
}

export interface RapidArtistTrack {
    uid?: string;
    track?: {
        album?: any;
        artists?: any;
        id?: string;
        name?: string;
        uri?: string;
        playcount?: string;
        duration?: {
            totalMilliseconds?: number;
        };
    };
}
