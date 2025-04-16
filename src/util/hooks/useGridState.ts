import { useState, useEffect } from 'react';
import { Cell } from '../../models/cell';
import { state } from '../../state/stateManager';

export const useGridState = (initialCells: Cell[]) => {
  const [grid, setGrid] = useState<Cell[]>(initialCells);

  const [numRows, setNumRows] = useState<number>(
    Math.max(...initialCells.map((cell) => cell.row)) + 1,
  );

  const [numCols, setNumCols] = useState<number>(
    Math.max(...initialCells.map((cell) => cell.col)) + 1,
  );

  useEffect(() => {
    const updateGrid = () => {
      if (JSON.stringify(state.grid) !== JSON.stringify(grid)) {
        setGrid([...state.grid]);
        const rows = Math.max(...state.grid.map((cell) => cell.row)) + 1;
        const cols = Math.max(...state.grid.map((cell) => cell.col)) + 1;
        setNumRows(rows);
        setNumCols(cols);
      }
    };

    state.subscribe(updateGrid);

    if (state.grid.length === 0) {
      state.setGrid(initialCells);
    }

    return () => {
      state.listeners = state.listeners.filter(
        (listener) => listener !== updateGrid,
      );
    };
  }, [initialCells, grid]);

  const updateGrid = (newGrid: Cell[]) => {
    setGrid(newGrid);
    state.setGrid(newGrid);
  };

  return {
    grid,
    numRows,
    numCols,
    setGrid: updateGrid,
    setNumRows,
    setNumCols,
  };
};
