import { FC, memo, useContext } from "react";

import { Dropdown, MenuProps } from "antd";
import {
    AddToQueueIcon,
    AlbumIcon,
    ArtistIcon,
    DeleteIcon,
    SaveTrack,
} from "~/assets/icons";
import { AuthContext } from "~/context/AuthContext";
import { toast } from "react-toastify";
import { removePlaylistItems } from "~/services/playlistApi";
import categoryApi from "~/services/categoryApi";
import {useNavigate} from "react-router-dom";
import {PlayerContext} from "~/context/PlayerContext";
interface TrackActionsWrapperProps {
    trigger?: ("contextMenu" | "click")[];
    children: React.ReactNode | React.ReactNode[];
    playlist?: any;
    setPlaylist?: any;
    myPlaylist?: any;
    track?: any;
}

export const menuUser: FC<TrackActionsWrapperProps> = memo(
    ({ children, trigger, track, playlist,setPlaylist }) => {
        const {userData}=useContext(AuthContext);

        const {
            queue,
            setQueue
        }=useContext(PlayerContext);

        const indexOfTrackInQueue = queue.findIndex(
            (item) => item?.id === track?.id,
        );

        
        const navigate = useNavigate();
        

        const isMine = userData?.id === playlist?.owner?.id;
        const canEdit = isMine || playlist?.collaborative;

        const getItems = () => {
            const items: MenuProps["items"] = [
                {
                    label: "Add to playlist",
                    icon: <SaveTrack />,
                    key: "1",
                    
                },
            ];

            if(canEdit&&playlist) {
                items.push({
                    label: 'Remove from this playlist',
                    key: '2',
                    icon: <DeleteIcon />,
                    onClick: () => {
                        removePlaylistItems(playlist!.id, [track.uri], playlist?.snapshot_id!)
                            .then(async () => {
                                toast.success("Remove from this playlist");
                                const data = await categoryApi({
                                    type: "playlists",
                                    id: playlist?.id,
                                })
                                setPlaylist(data);
                            });
                    },
                });
            }

            items.push(
                {
                    label: "Add to queue",
                    key: "3",
                    icon: <AddToQueueIcon />,
                    onClick: () => {
                        if(indexOfTrackInQueue === -1) {
                            setQueue(track? [{
                                queue,
                                ...track,
                             }] : []);
                        }                        
                    },
                },
                { type: "divider" },
                {
                    label: "Go to artist",
                    key: "5",
                    icon: <ArtistIcon />,
                    onClick: () => {
                        navigate(
                            // @ts-ignore
                            `/artist/${track.artists[0]?.id || track.artists[0].uri.split(':').reverse()[0]}`
                        );
                    },
                },
                {
                    label: "Go to album",
                    key: "6",
                    icon: <AlbumIcon />,
                    onClick: () => {
                        // @ts-ignore
                        navigate(`/album/${track.album?.id || track.album.uri.split(':').reverse()[0]}`);
                    },
                },
            );
            return items;
        };

        const items = getItems();

        return (
            <>
                <Dropdown menu={{ items }} trigger={trigger}>
                    {children}
                </Dropdown>
            </>
        );
    },
);
