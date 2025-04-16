import { useState, useEffect, useRef } from 'react';
import {
  handleKeyDown,
  handleMouseDown,
  handleMouseEnter,
} from '../../util/functions/keyboard';
import type { Cell } from '../../models/cell';

export const useCellSelection = (grid: Cell[], numRows: number) => {
  const [selectedCells, setSelectedCells] = useState<
    { row: number; col: number }[]
  >([]);

  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    if (selectedCells.length > 0) {
      const { row, col } = selectedCells[0];
      const inputKey = `${row}-${col}`;
      const inputElement = inputRefs.current[inputKey];
      if (inputElement) {
        inputElement.focus();
      }
    }
  }, [selectedCells]);

  const onMouseDown = (row: number, col: number, e: React.MouseEvent) => {
    if (e.button === 0) {
      handleMouseDown(row, col, setSelectedCells, setIsSelecting);
    }
  };

  const onMouseEnter = (row: number, col: number) => {
    handleMouseEnter(row, col, isSelecting, selectedCells, setSelectedCells);
  };

  const onMouseUp = () => setIsSelecting(false);

  const onKeyDown = (
    e: React.KeyboardEvent,
    row: number,
    col: number,
    callback?: (newCell: { row: number; col: number }) => void,
  ) => {
    //@ts-ignore
    const newCell = handleKeyDown(e, row, col, numRows, grid, setSelectedCells);
    if (newCell) {
      callback?.(newCell);
    }
  };

  const isCellSelected = (row: number, col: number) =>
    selectedCells.some((cell) => cell.row === row && cell.col === col);

  return {
    selectedCells,
    isSelecting,
    inputRefs,
    isCellSelected,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    onKeyDown,
    setSelectedCells,
  };
};
