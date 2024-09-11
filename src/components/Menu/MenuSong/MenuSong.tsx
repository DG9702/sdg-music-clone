import { FC, useContext, useState } from "react";
import Tippy from "@tippyjs/react/headless";
import classNames from "classnames/bind";

import { AuthContext } from "~/context/AuthContext";
import { getUserPlaylist } from "~/services/userApi";
import Button from "~/components/Button";
import styles from "../Menu.module.scss";
const cx = classNames.bind(styles);

interface MenuItemData {
    type: string;
    title: string;
    icon?: React.ReactNode;
    to?: string;
    separate?: boolean;
    children?: MenuItemData[];
}

interface MenuProps {
    children: React.ReactNode;
    items?: MenuItemData[];
    sort?: MenuItemData[];
    viewas?: MenuItemData[];
    isLib?: boolean;
    onChange?: (item: MenuItemData) => void;
    isOpen?: boolean;
}

//const defaultFn = () => {};

const MenuSong: FC<MenuProps> = ({
    children,
    items = [],
    //onChange = defaultFn,
    isOpen = false,
    sort = [],
    viewas = [],
    isLib = false,
}) => {
    const {userData}=useContext(AuthContext);
    
    const [userPlaylist, setUserPlaylist]=useState<any>([]);

    const handleUserCurrentPlaylist = async () => {
        return items.map((item, index) => (
            <li key={index}>
                <Button
                    type="menu"
                    rightIcon={item.icon}
                    onMouseOver={() => {
                        if (item.type === "playlist") {
                            handleUserCurrentPlaylist();
                        }
                    }}
                >
                    {item.title}
                </Button>
            </li>
        ));
    };

    const renderItems = () => {
        return items.map((item, index) => (
            <li key={index}>
                <Button
                    type="menu"
                    rightIcon={item.icon}
                    onMouseOver={() => {
                        if (item.type === "playlist") {
                            handleUserCurrentPlaylist();
                        }
                    }}
                >
                    {item.title}
                </Button>
            </li>
        ));
    };

    const renderResult = (attrs: any) => (
        <div className={cx("menu-list")} tabIndex="-1" {...attrs}>
            <div
                className={cx("menu-popper")}
                style={{
                    minWidth: isLib ? "150px" : "",
                }}
            >
                <ul className={cx("menu-body")}>{renderItems()}</ul>
            </div>
        </div>
    );

    return (
        <Tippy
            interactive={true}
            placement={"bottom-end"}
            delay={[1000, 100]}
            zIndex={99999}
            offset={[0, 10]}
            visible={isOpen}
            render={renderResult}
        >
            <div>{children}</div>
        </Tippy>
    );
};

export default MenuSong;
