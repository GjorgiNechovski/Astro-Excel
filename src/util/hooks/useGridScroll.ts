import { useEffect, useRef } from "react";
import { Cell } from "../../models/cell";
import { createCell } from "../../util/functions/cell-helper";

export const useGridScroll = (
  numRows: number,
  numCols: number,
  grid: Cell[],
  setGrid: (grid: Cell[]) => void,
  setNumRows: (rows: number) => void,
  setNumCols: (cols: number) => void,
  getColumnLabel: (col: number) => string
) => {
  const gridRef = useRef<HTMLDivElement>(null);

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

  return { gridRef };
};
