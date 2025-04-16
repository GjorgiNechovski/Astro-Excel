import type { Cell } from '../../models/cell';
import { state } from '../../state/stateManager';

export const handleKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  row: number,
  col: number,
  numRows: number,
  grid: Cell[],
  setSelectedCells: React.Dispatch<
    React.SetStateAction<{ row: number; col: number }[]>
  >,
): { row: number; col: number } | null => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();

    let newRow = row;
    let newCol = col;

    switch (e.key) {
      case 'ArrowUp':
        if (row > 0) newRow--;
        break;
      case 'ArrowDown':
        if (row < numRows - 1) newRow++;
        break;
      case 'ArrowLeft':
        if (col > 0) newCol--;
        break;
      case 'ArrowRight':
        if (col < grid.filter((cell) => cell.row === row).length - 1) newCol++;
        break;
      default:
        return null;
    }

    setSelectedCells([{ row: newRow, col: newCol }]);
    state.setSelectedCells([{ row: newRow, col: newCol }]);

    return { row: newRow, col: newCol };
  }

  return null;
};

export const handleMouseDown = (
  row: number,
  col: number,
  setSelectedCells: React.Dispatch<
    React.SetStateAction<{ row: number; col: number }[]>
  >,
  setIsSelecting: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  setIsSelecting(true);
  setSelectedCells([{ row, col }]);
  state.setSelectedCells([{ row, col }]);
};

export const handleMouseEnter = (
  row: number,
  col: number,
  isSelecting: boolean,
  selectedCells: { row: number; col: number }[],
  setSelectedCells: React.Dispatch<
    React.SetStateAction<{ row: number; col: number }[]>
  >,
) => {
  if (isSelecting) {
    const startCell = selectedCells[0];
    if (!startCell) return;

    const newSelectedCells = [];
    const minRow = Math.min(startCell.row, row);
    const maxRow = Math.max(startCell.row, row);
    const minCol = Math.min(startCell.col, col);
    const maxCol = Math.max(startCell.col, col);

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        newSelectedCells.push({ row: r, col: c });
      }
    }

    setSelectedCells(newSelectedCells);
    state.setSelectedCells(newSelectedCells);
  }
};
