import { ArtistData } from "./artist";

export interface ImageSource {
    url: string;
    width: number;
    height: number;
}

export interface ColorRaw {
    hex: string;
}

export interface ExtractedColors {
    colorRaw: ColorRaw;
}

export interface GalleryItem {
    sources: ImageSource[];
}

export interface Gallery {
    items: GalleryItem[];
}

export interface AvatarImage {
    sources: ImageSource[];
    extractedColors: ExtractedColors;
}

export interface HeaderImage {
    sources: ImageSource[];
    extractedColors: ExtractedColors;
}

export interface HeaderProps {
    title?: string;
    thumbnail?: string;
    iconHead?: any;
    quantity?: number;
    type?:
        | "Playlist"
        | "album"
        | "single"
        | "compilation"
        | "podcast"
        | "episode"
        | "user";
    bgColor?: string;
    desc?: string;
    isLoading?: boolean;
    artists?: ArtistData[];
    owner?: {
        image?: string;
        display_name?: string;
        id?: string;
    };
    releaseDate?: string;
    isWhiteColor?: boolean;
    headerType?: "user" | "playlist" | "album" | "show" | "genre";
    publisher?: string;
    showName?: string;
    showId?: string;
}
