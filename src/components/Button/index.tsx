import React, { ReactNode } from "react";
import classNames from "classnames/bind";
import styles from "./Button.module.scss";

const cx = classNames.bind(styles);

interface ButtonProps {
  type?: "default" | "text" | "primary" | "circle" | "menu";
  bgColor?: string;
  navOpacity?: number;
  disabled?: Boolean;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  onClick?: any;
  onMouseOver?: any;
  small?: boolean;
  large?: boolean;
  children: ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps>=({
    type,
    bgColor,
    navOpacity,
    rightIcon,
    leftIcon,
    onClick,
    onMouseOver,
    small,
    large,
    className,
    children,
}) => {

  const classes = cx(
    "btn",
    {
      "btn-default": type === "default",
      "btn-menu": type === "menu",
      "btn-text": type === "text",
      "btn-primary": type === "primary",
      "btn-circle": type === "circle",

      navOpacity,
      small,
      large,
    },
    className,
  );

  return (
    <button className={classes} onClick={onClick} onMouseOver={onMouseOver}>
      <span
        style={{
          backgroundColor: bgColor,
        }}
        className={cx("btn-body")}
      >
        {leftIcon && <span className={cx("left-icon")}>{leftIcon}</span>}
        <span className={cx("title")}>{children}</span>
        {rightIcon && <span className={cx("right-icon")}>{rightIcon}</span>}
      </span>
    </button>
  );
};

export default Button;
