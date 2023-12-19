import React, { FC, ReactNode } from "react";
import classNames from "classnames/bind";
import styles from "./Button.module.scss";

const cx = classNames.bind(styles);

interface ButtonProps {
  type?: "default" | "text" | "primary" | "circle";
  bgColor?: string | null;
  navOpacity?: number;
  disabled?: Boolean;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  handleClickPlayBtn?: any;
  small?: boolean;
  large?: boolean;
  children: ReactNode;
  className?: string;
}

const Button: FC<ButtonProps> = (props) => {
  const {
    type = "default",
    bgColor,
    navOpacity = 1,
    disabled = false,
    rightIcon,
    leftIcon,
    handleClickPlayBtn,
    small = false,
    large = false,
    className,
    children,
  } = props;

  // Remove event listener when btn is disabled

  const classes = cx("btn", {
    "btn-default": type === "default",
    "btn-text": type === "text",
    "btn-primary": type === "primary",
    "btn-circle": type === "circle",
    bgColor,
    navOpacity,
  });

  return (
    <button className={classes}>
      {leftIcon && <span className={cx("icon")}>{leftIcon}</span>}
      <span className={cx("title")}>{children}</span>
      {rightIcon && <span className={cx("icon")}>{rightIcon}</span>}
    </button>
  );
};

export default Button
