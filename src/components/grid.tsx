import { useEffect, useState, useRef } from "react";
import {
  handleKeyDown,
  handleMouseDown,
  handleMouseEnter,
} from "../util/functions/keyboard";
import type { Cell } from "../models/cell";
import { state } from "../state/stateManager";

type SelectedCell = {
  row: number;
  col: number;
} | null;

interface GridProps {
  cells: Cell[];
}
export default function Grid({ cells: data }: GridProps) {
  const [grid, setGrid] = useState<Cell[]>(data);
  const [numRows, setNumRows] = useState<number>(0);
  const [selectedCells, setSelectedCells] = useState<
    { row: number; col: number }[]
  >([]);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    const rows = Math.max(...data.map((cell) => cell.row)) + 1;
    setNumRows(rows);
  }, [data]);

  const handleInputChange = (row: number, col: number, value: string) => {
    const updatedGrid = grid.map((cell) =>
      cell.row === row && cell.col === col ? { ...cell, data: value } : cell
    );

    setGrid(updatedGrid);
    state.setGrid(updatedGrid);
    state.setSelectedCell({ row, col });
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
                value={cell.data}
                style={{
                  width: cell.styles?.width,
                  height: cell.styles?.height,
                  border: cell.styles?.border,
                  padding: cell.styles?.padding,
                  textAlign: cell.styles?.textAlign,
                  backgroundColor: isCellSelected(cell.row, cell.col)
                    ? "lightblue"
                    : cell.styles?.backgroundColor,
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
