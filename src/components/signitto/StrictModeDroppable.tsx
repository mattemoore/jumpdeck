// StrictModeDroppable.tsx
// Credits to https://github.com/GiovanniACamacho and https://github.com/Meligy for the TypeScript version
// Original post: https://github.com/atlassian/react-beautiful-dnd/issues/2399#issuecomment-1175638194
import React, { useEffect, useState } from 'react';
import { Droppable, type DroppableProps } from 'react-beautiful-dnd';

export const StrictModeDroppable = ({
  children,
  ...props
}: DroppableProps): JSX.Element => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const animation = requestAnimationFrame(() => {
      setEnabled(true);
    });
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return <></>;
  }
  return <Droppable {...props}>{children}</Droppable>;
};
