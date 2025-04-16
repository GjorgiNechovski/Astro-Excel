import { useState, useEffect } from 'react';
import { Cell } from '../../models/cell';

export const useGridResize = (
  grid: Cell[],
  setGrid: (grid: Cell[]) => void,
) => {
  const [resizing, setResizing] = useState<{
    type: 'row' | 'col';
    index: number;
    startPos: number;
  } | null>(null);

  const handleMouseDownOnBorder = (
    type: 'row' | 'col',
    index: number,
    e: React.MouseEvent,
  ) => {
    setResizing({
      type,
      index,
      startPos: type === 'col' ? e.clientX : e.clientY,
    });
  };

  const handleResize = (e: MouseEvent) => {
    if (resizing) {
      const { type, index, startPos } = resizing;
      const newSize =
        type === 'col' ? e.clientX - startPos : e.clientY - startPos;

      const updatedGrid = grid.map((cell) => {
        if (type === 'col' && cell.col === index) {
          return {
            ...cell,
            styles: {
              ...cell.styles,
              width: `${
                parseInt(cell.styles?.width || '100px', 10) + newSize
              }px`,
            },
          };
        } else if (type === 'row' && cell.row === index) {
          return {
            ...cell,
            styles: {
              ...cell.styles,
              height: `${
                parseInt(cell.styles?.height || '30px', 10) + newSize
              }px`,
            },
          };
        }
        return cell;
      });

      //@ts-ignore
      setGrid(updatedGrid);
      setResizing({
        type,
        index,
        startPos: type === 'col' ? e.clientX : e.clientY,
      });
    }
  };

  const handleMouseUp = () => {
    setResizing(null);
  };

  useEffect(() => {
    if (resizing) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizing]);

  return { handleMouseDownOnBorder };
};
