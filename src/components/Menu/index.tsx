import { FC, useContext } from "react";
import Tippy from "@tippyjs/react/headless";
import classNames from "classnames/bind";

import styles from "./Menu.module.scss";
import Button from "../Button";
import { AuthContext } from "~/context/AuthContext";

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

const Menu: FC<MenuProps> = ({
  children,
  items = [],
  //onChange = defaultFn,
  isOpen = false,
  sort = [],
  viewas = [],
  isLib = false,
}) => {
  const { handleLogout } = useContext(AuthContext);

  const renderItems = () => {
    return items.map((item, index) => (
      <li key={index}>
        <Button
          type="menu"
          rightIcon={item.icon}
          onClick={() => {
            if (item.type === "Logout") {
              console.log("Click logout");
              handleLogout();
            }
          }}
        >
          {item.title}
        </Button>
      </li>
    ));
  };

  const renderLibMenuItem = () => {
    return (
      <>
        <ul className={cx("menu-body", "menu-lib")}>
          <li className={cx("menu-head")}>
            <span>Sort by</span>
          </li>
          {sort.map((item, index) => (
            <li key={index}>
              <Button type="menu" leftIcon={item.icon}>
                {item.title}
              </Button>
            </li>
          ))}
        </ul>
        <ul className={cx("menu-body", "menu-lib")}>
          <li className={cx("menu-head")}>
            <span>View as</span>
          </li>
          {viewas.map((item, index) => (
            <li key={index}>
              <Button className={cx("lib")} type="menu" leftIcon={item.icon}>
                {item.title}
              </Button>
            </li>
          ))}
        </ul>
      </>
    );
  };

  const renderResult = (attrs: any) => (
    <div className={cx("menu-list")} tabIndex="-1" {...attrs}>
      <div className={cx("menu-popper")} style={{
        minWidth: isLib ? '150px' : ''
      }}>
        {isLib ? (
          renderLibMenuItem()
        ) : (
          <ul className={cx("menu-body")}>{renderItems()}</ul>
        )}
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

export default Menu;
