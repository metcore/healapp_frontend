import React from "react";
import PropTypes from "prop-types";

const Badge = ({
  children,
  variant = "primary",
  size = "sm",
  soft = false,
  className = "",
}) => {
  const variantClasses = {
    primary: soft
      ? "text-primary-600 bg-primary-100"
      : "text-white bg-primary-600",
    secondary: soft
      ? "text-lilac-600 bg-lilac-100"
      : "text-white bg-lilac-600",
    success: soft
      ? "text-success-600 bg-success-100"
      : "text-white bg-success-600",
    info: soft
      ? "text-info-600 bg-info-100"
      : "text-white bg-info-600",
    warning: soft
      ? "text-warning-600 bg-warning-100"
      : "text-white bg-warning-600",
    danger: soft
      ? "text-danger-600 bg-danger-100"
      : "text-white bg-danger-600",
    dark: soft
      ? "text-neutral-800 bg-neutral-300"
      : "text-white bg-neutral-800",
    light: soft
      ? "text-secondary-light bg-light-100"
      : "text-neutral-800 bg-light-100",
    link: "bg-transparent text-primary-600",
  };

  const sizeClasses = {
    sm: "text-sm px-12 py-6",
    md: "text-base px-16 py-8",
    lg: "text-lg px-20 py-9",
  };

  return (
    <span
      className={`badge fw-semibold radius-4 ${variantClasses[variant]} ${
        sizeClasses[size]
      } ${className}`}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "info",
    "warning",
    "danger",
    "dark",
    "light",
    "link",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  soft: PropTypes.bool,
  className: PropTypes.string,
};

export default Badge;
