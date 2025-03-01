import { useEffect, useState, useRef } from "react";
import {
  handleKeyDown,
  handleMouseDown,
  handleMouseEnter,
} from "../../util/functions/keyboard";
import type { Cell } from "../../models/cell";
import { state } from "../../state/stateManager";
import { evaluateFormula } from "../../util/functions/math";

interface GridProps {
  cells: Cell[];
}

export default function Grid({ cells: initialCells }: GridProps) {
  const [grid, setGrid] = useState<Cell[]>(initialCells);
  const [numRows, setNumRows] = useState<number>(
    Math.max(...initialCells.map((cell) => cell.row)) + 1
  );
  const [selectedCells, setSelectedCells] = useState<
    { row: number; col: number }[]
  >([]);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    const updateGrid = () => {
      if (JSON.stringify(state.grid) !== JSON.stringify(grid)) {
        setGrid([...state.grid]);
        const rows = Math.max(...state.grid.map((cell) => cell.row)) + 1;
        setNumRows(rows);
      }
    };

    state.subscribe(updateGrid);

    if (state.grid.length === 0) {
      state.setGrid(initialCells);
    }

    return () => {
      state.listeners = state.listeners.filter(
        (listener) => listener !== updateGrid
      );
    };
  }, [initialCells, grid]);

  useEffect(() => {
    const updatedGrid = grid.map((cell) => {
      if (cell.displayValue.endsWith("=")) {
        const formula = cell.displayValue.slice(0, -1);
        const result = evaluateFormula(formula, grid);
        return { ...cell, realValue: result };
      }
      return cell;
    });

    if (JSON.stringify(updatedGrid) !== JSON.stringify(grid)) {
      setGrid(updatedGrid);
      state.setGrid(updatedGrid);
    }
  }, [grid]);

  const handleInputChange = (row: number, col: number, value: string) => {
    let updatedGrid;

    if (value.endsWith("=")) {
      const formula = value.slice(0, -1);
      updatedGrid = grid.map((cell) =>
        cell.row === row && cell.col === col
          ? {
              ...cell,
              displayValue: `${formula}=`,
              realValue: value,
            }
          : cell
      );
    } else {
      updatedGrid = grid.map((cell) =>
        cell.row === row && cell.col === col
          ? {
              ...cell,
              displayValue: value,
              realValue: value,
            }
          : cell
      );
    }

    setGrid(updatedGrid);
    state.setGrid(updatedGrid);
    state.setSelectedCells([{ row, col }]);
  };

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some((cell) => cell.row === row && cell.col === col);
  };

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

  const getRows = () => {
    const rowsArray = [];
    for (let i = 0; i < numRows; i++) {
      const rowCells = grid.filter((cell) => cell.row === i);
      rowsArray.push(
        <div key={i} style={{ display: "flex" }}>
          {rowCells.map((cell, index) => {
            const inputKey = `${cell.row}-${cell.col}`;
            return (
              <input
                key={index}
                value={cell.realValue}
                style={{
                  width: cell.styles?.width || "100px",
                  height: cell.styles?.height || "30px",
                  border: cell.styles?.border || "1px solid #ccc",
                  padding: cell.styles?.padding || "2px",
                  textAlign: cell.styles?.textAlign || "left",
                  backgroundColor: isCellSelected(cell.row, cell.col)
                    ? "lightblue"
                    : cell.styles?.backgroundColor || "white",
                  color: cell.styles?.color || "black",
                }}
                disabled={cell.disabled}
                onChange={(e) =>
                  handleInputChange(cell.row, cell.col, e.target.value)
                }
                onKeyDown={(e) => {
                  const newCell = handleKeyDown(
                    e,
                    cell.row,
                    cell.col,
                    numRows,
                    grid,
                    setSelectedCells
                  );
                  if (newCell) {
                    const newInputKey = `${newCell.row}-${newCell.col}`;
                    const newInputElement = inputRefs.current[newInputKey];
                    if (newInputElement) {
                      newInputElement.focus();
                    }
                  }
                }}
                onMouseDown={() =>
                  handleMouseDown(
                    cell.row,
                    cell.col,
                    setSelectedCells,
                    setIsSelecting
                  )
                }
                onMouseEnter={() =>
                  handleMouseEnter(
                    cell.row,
                    cell.col,
                    isSelecting,
                    selectedCells,
                    setSelectedCells
                  )
                }
                onMouseUp={() => setIsSelecting(false)}
                ref={(el) => {
                  inputRefs.current[inputKey] = el;
                }}
              />
            );
          })}
        </div>
      );
    }
    return rowsArray;
  };

  return <div onMouseUp={() => setIsSelecting(false)}>{getRows()}</div>;
}
