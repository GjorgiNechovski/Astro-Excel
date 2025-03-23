import { useEffect, useState, useRef } from "react";
import {
  handleKeyDown,
  handleMouseDown,
  handleMouseEnter,
} from "../../util/functions/keyboard";
import { Cell } from "../../models/cell";
import { state } from "../../state/stateManager";
import { evaluateFormula } from "../../util/functions/math";
import ContextMenu from "../ContextMenu/ContextMenu";
import { createCell } from "../../util/functions/cell-helper";

interface GridProps {
  cells: Cell[];
}

export default function Grid({ cells: initialCells }: GridProps) {
  const [grid, setGrid] = useState<Cell[]>(initialCells);
  const [numRows, setNumRows] = useState<number>(
    Math.max(...initialCells.map((cell) => cell.row)) + 1
  );
  const [numCols, setNumCols] = useState<number>(
    Math.max(...initialCells.map((cell) => cell.col)) + 1
  );
  const [selectedCells, setSelectedCells] = useState<
    { row: number; col: number }[]
  >([]);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [resizing, setResizing] = useState<{
    type: "row" | "col";
    index: number;
    startPos: number;
  } | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const gridRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const getColumnLabel = (col: number): string => {
    let label = "";
    let tempCol = col - 1;
    do {
      label = String.fromCharCode(65 + (tempCol % 26)) + label;
      tempCol = Math.floor(tempCol / 26) - 1;
    } while (tempCol >= 0);
    return label;
  };

  const expandGrid = (direction: "row" | "col") => {
    const newCells: Cell[] = [];
    if (direction === "row") {
      const newRowStart = numRows;
      const newRowEnd = newRowStart + 10;
      for (let i = newRowStart; i < newRowEnd; i++) {
        for (let j = 0; j < numCols; j++) {
          const isHeader = j === 0;
          const value = isHeader ? i.toString() : "";
          newCells.push(createCell(value, value, i, j, isHeader));
        }
      }
      setNumRows(newRowEnd);
    } else if (direction === "col") {
      const newColStart = numCols;
      const newColEnd = newColStart + 10;
      for (let j = newColStart; j < newColEnd; j++) {
        for (let i = 0; i < numRows; i++) {
          const isHeader = i === 0;
          const value = isHeader ? getColumnLabel(j) : "";
          newCells.push(createCell(value, value, i, j, isHeader));
        }
      }
      setNumCols(newColEnd);
    }

    if (newCells.length > 0) {
      const updatedGrid = [...grid, ...newCells];
      setGrid(updatedGrid);
      state.setGrid(updatedGrid);
    }
  };

  const handleScroll = () => {
    const gridElement = gridRef.current;
    if (!gridElement) return;

    const {
      scrollTop,
      scrollHeight,
      clientHeight,
      scrollLeft,
      scrollWidth,
      clientWidth,
    } = gridElement;

    if (scrollHeight - scrollTop - clientHeight < 10) {
      expandGrid("row");
    }

    if (scrollWidth - scrollLeft - clientWidth < 10) {
      expandGrid("col");
    }
  };

  useEffect(() => {
    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (gridElement) {
        gridElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [numRows, numCols]);

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
        (listener) => listener !== updateGrid
      );
    };
  }, [initialCells, grid]);

  useEffect(() => {
    const updatedGrid = grid.map((cell) => {
      if (cell.displayValue.endsWith("=")) {
        const formula = cell.displayValue.slice(0, -1);
        const evaluatingCells = new Set<string>();
        const cellKey = `${cell.row}-${cell.col}`;
        evaluatingCells.add(cellKey);
        const result = evaluateFormula(formula, grid, evaluatingCells);
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
          ? { ...cell, displayValue: `${formula}=`, realValue: value }
          : cell
      );
    } else {
      updatedGrid = grid.map((cell) =>
        cell.row === row && cell.col === col
          ? { ...cell, displayValue: value, realValue: value }
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

  const handleMouseDownOnBorder = (
    type: "row" | "col",
    index: number,
    e: React.MouseEvent
  ) => {
    setResizing({
      type,
      index,
      startPos: type === "col" ? e.clientX : e.clientY,
    });
  };

  const handleResize = (e: MouseEvent) => {
    if (resizing) {
      const { type, index, startPos } = resizing;
      const newSize =
        type === "col" ? e.clientX - startPos : e.clientY - startPos;

      const updatedGrid = grid.map((cell) => {
        if (type === "col" && cell.col === index) {
          return {
            ...cell,
            styles: {
              ...cell.styles,
              width: `${
                parseInt(cell.styles?.width || "100px", 10) + newSize
              }px`,
            },
          };
        } else if (type === "row" && cell.row === index) {
          return {
            ...cell,
            styles: {
              ...cell.styles,
              height: `${
                parseInt(cell.styles?.height || "30px", 10) + newSize
              }px`,
            },
          };
        }
        return cell;
      });

      //@ts-ignore
      setGrid(updatedGrid);
      //@ts-ignore
      state.setGrid(updatedGrid);
      setResizing({
        type,
        index,
        startPos: type === "col" ? e.clientX : e.clientY,
      });
    }
  };

  const handleMouseUp = () => {
    setResizing(null);
  };

  useEffect(() => {
    if (resizing) {
      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleResize);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizing]);

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (selectedCells.length > 0) {
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  const getRows = () => {
    const rowsArray = [];
    for (let i = 0; i < numRows; i++) {
      const rowCells = grid.filter((cell) => cell.row === i);
      rowsArray.push(
        <div key={i} style={{ display: "flex", position: "relative" }}>
          {rowCells.map((cell, index) => {
            const inputKey = `${cell.row}-${cell.col}`;
            let displayText = cell.realValue;
            if (
              cell.roundNumbers !== undefined &&
              cell.realValue !== "" &&
              !isNaN(Number(cell.realValue))
            ) {
              displayText = Number(cell.realValue).toFixed(cell.roundNumbers);
            }

            return (
              <div key={index} style={{ position: "relative" }}>
                <input
                  value={displayText}
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
                    fontSize: cell.styles?.fontSize || "18px",
                    fontFamily: cell.styles?.fontFamily || "Arial, sans-serif",
                    fontWeight: cell.styles?.fontWeight || "normal",
                    fontStyle: cell.styles?.fontStyle || "normal",
                    textDecoration: cell.styles?.textDecoration || "none",
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
                      if (newCell.row >= numRows - 1) expandGrid("row");
                      if (newCell.col >= numCols - 1) expandGrid("col");
                      const newInputKey = `${newCell.row}-${newCell.col}`;
                      const newInputElement = inputRefs.current[newInputKey];
                      if (newInputElement) {
                        newInputElement.focus();
                      }
                    }
                  }}
                  onMouseDown={(e) => {
                    if (e.button === 0) {
                      handleMouseDown(
                        cell.row,
                        cell.col,
                        setSelectedCells,
                        setIsSelecting
                      );
                    }
                  }}
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
                {index < rowCells.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: "5px",
                      cursor: "col-resize",
                      backgroundColor: "transparent",
                    }}
                    onMouseDown={(e) =>
                      handleMouseDownOnBorder("col", cell.col, e)
                    }
                  />
                )}
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "5px",
              cursor: "row-resize",
              backgroundColor: "transparent",
            }}
            onMouseDown={(e) => handleMouseDownOnBorder("row", i, e)}
          />
        </div>
      );
    }
    return rowsArray;
  };

  return (
    <div
      ref={gridRef}
      style={{ overflow: "auto", height: "100%", width: "100%" }}
      onMouseUp={() => setIsSelecting(false)}
      onContextMenu={handleContextMenu}
    >
      {getRows()}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onSetRoundNumbers={(decimals) => {
            const updatedGrid = grid.map((cell) =>
              selectedCells.some(
                (sel) => sel.row === cell.row && sel.col === cell.col
              )
                ? { ...cell, roundNumbers: decimals }
                : cell
            );
            setGrid(updatedGrid);
            state.setGrid(updatedGrid);
            setContextMenu(null);
          }}
        />
      )}
    </div>
  );
}
