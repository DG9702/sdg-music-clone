import { AlbumItem } from "./album";
import { ArtistData, ArtistItem } from "./artist";
import { PlayListItem } from "./playlist";

export type LibSelection = {
    title: string;
    id: string;
    type: "playlist" | "album" | "artist";
    active: boolean;
};

export interface ResponseLibItem {
    id?: string;
    owner?: {
        display_name?: string;
    };
    artists?: ArtistData[];
    name?: string;
    images?: {
        url?: string;
    }[];
}

export interface SidebarItemProps {
    author?: string;
    searchValue?: any;
    icon?: any;
    isEpisodes?: boolean;
    view?: "Compact" | "List" | "Grid";
    type?: "playlist" | "artist" | "album" | "collection";
    thumbnail?: string | undefined;
    name?: string | undefined;
    id?: string;
    artists?: ArtistData[];
}

export interface LibDataItem extends PlayListItem, AlbumItem, ArtistItem {
    owner?: {
        display_name: string;
    };
    artists?: ArtistData[];
}
