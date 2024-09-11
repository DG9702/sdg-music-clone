import { FC, memo, useEffect, useState } from "react";
import classNames from "classnames/bind";
import { Dropdown, Flex, Space } from "antd";
import {
    GridIcon,
    OrderCompactIcon,
    OrderListIcon,
    SearchIcon,
} from "~/assets/icons";

import styles from "../Sidebar.module.scss";

const cx = classNames.bind(styles);

export interface AreaProps {
    view?: any;
    setView?: any;
    searchValue?: any;
    setSearchValue?: any;
}

const VIEW = ["Compact", "List", "Grid"] as const;

const SearchSelector: FC<AreaProps> = memo(({ searchValue, setSearchValue }) => {
    const [showInput, setShowInput] = useState<boolean>(false);

    console.log("Check searchValue: ", searchValue);
    
  
    const handleClickSearchPlaylist = (): void => {
        document.getElementById("inputSearch")?.classList.add(cx("hien"));
        setShowInput(true);
    };

    const handleCloseInput = (): void => {
        document.getElementById("inputSearch")?.classList.remove(cx("hien"));
        setShowInput(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const inputRef = document.getElementById("inputSearch");
            if (inputRef && !inputRef.contains(event.target as Node)) {
                handleCloseInput();
            }
        };

        if (showInput) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showInput]);

    return (
        <div
            id="inputSearch"
            className={cx("head-search", {
                hien: showInput,
            })}
        >
            <input
                value={searchValue}
                onChange={(e) => setSearchValue(e?.target?.value)}
                id="search"
                className={cx("inputSearch", "opacity")}
                placeholder="Search in Your Library"
                
            />
            <button onClick={() => handleClickSearchPlaylist()}>
                <SearchIcon />
            </button>
        </div>
    );
});

const ViewSelector: FC<AreaProps>=memo(({view, setView}) => {
    const items = VIEW.map((view) => ({
        key: view,
        label: view,
        onClick: () => {
            setView(view);
        },
    }));

    return (
        <Dropdown
            placement="bottomRight"
            className="viewSelector"
            menu={{ items, selectedKeys: [view] }}
            trigger={["click"]}
        >
            <button className="order-button">
                <Space
                    align="center"
                    style={{
                        background: "#121212",
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: "pointer",
                    }}
                >
                    <span>{view}</span>
                    <span style={{ display: "flex" }}>
                        {view === "Grid" ? <GridIcon size={16} /> : null}
                        {view === "List" ? <OrderListIcon size={16} /> : null}
                        {view === "Compact" ? (
                            <OrderCompactIcon size={16} />
                        ) : null}
                    </span>
                </Space>
            </button>
        </Dropdown>
    );
});

export const SearchArea: FC<AreaProps> = ({
    view,
    setView,
    searchValue,
    setSearchValue,
}) => {
    return (
        <Flex align="center" justify="space-between" style={{ margin: "10px" }}>
            <SearchSelector
                searchValue={searchValue}
                setSearchValue={setSearchValue}
            />
            <ViewSelector view={view} setView={setView} />
        </Flex>
    );
};
