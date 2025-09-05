import { Icon } from "@iconify/react";
import Badge from "../primitive/badge/Badge";

export default function ProductTypeBadge({ type }) {
  const renderBadge = () => {
    if (type === "product") {
      return { label: "Produk", icon: "mdi:package-variant" };
    } else if (type === "treatment") {
      return { label: "Treatment", icon: "mdi:stethoscope" };
    } else {
      return { label: "Unknown", icon: "mdi:help-circle" };
    }
  };

  const { label, icon } = renderBadge();

  return (
    <Badge
      size="xs"
      variant={
        type === "product"
          ? "success"
          : type === "treatment"
          ? "warning"
          : "secondary"
      }
      className="align-items-center"
    >
      <div className="d-flex align-items-center flex-wrap gap-1">
        <Icon icon={icon} width="14" height="14" />
        {label}
      </div>
    </Badge>
  );
}
