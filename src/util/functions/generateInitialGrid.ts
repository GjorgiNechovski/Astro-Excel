import { cellHeight, cellWidth } from "../../assets/contants";
import { Cell, type ICellStyle } from "../../models/cell";

export const createInitialGrid = (rows: number, cols: number) => {
  const newGrid: Cell[] = [];
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const newCell = new Cell("", "", i, j, false);

      if (i === 0 || j === 0) {
        newCell.disabled = true;
      }

      if (i === 0 && j > 0) {
        newCell.realValue = alphabet[j - 1] || "";
        newCell.displayValue = alphabet[j - 1] || "";
      }

      if (j === 0 && i > 0) {
        newCell.realValue = i.toString();
        newCell.displayValue = i.toString();
      }

      const cellStyle: ICellStyle = {
        width: `${cellWidth}px`,
        height: `${cellHeight}px`,
        border: "1px solid black",
        padding: "0",
        textAlign: newCell.disabled ? "center" : "start",
        backgroundColor: newCell.disabled ? "#ff9563" : "white",
      };

      newCell.styles = cellStyle;

      newGrid.push(newCell);
    }
  }

  return newGrid;
};
