import React, { useState, useEffect } from 'react';
import Card from '../card/Card';

export default function Accordion({
  children,
  renderHeader,
  isOpen,
  onCollapse,
  variant = 'default',
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const toggle = () => {
    onCollapse?.(isExpanded ? false : true);
    setIsExpanded(isExpanded ? false : true);
  };

  useEffect(() => {
    setIsExpanded(isOpen ?? false);
  }, [isOpen]);

  return (
    <div>
      <Card
        renderHeader={renderHeader}
      >
        <p>tes</p>
      </Card>
    </div>
  );
}
