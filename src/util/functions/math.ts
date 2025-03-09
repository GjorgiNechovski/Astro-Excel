import type { Cell } from "../../models/cell";

const parseFormula = (formula: string): string[] => {
  const regex = /([A-Z]+\d+)/g;
  return formula.match(regex) || [];
};

export const cellReferenceToIndices = (
  ref: string
): { row: number; col: number } => {
  const colLetters = ref.match(/[A-Z]+/)![0];
  const rowNumber = parseInt(ref.match(/\d+/)![0]);
  let col = 0;
  for (let i = 0; i < colLetters.length; i++) {
    col = col * 26 + (colLetters.charCodeAt(i) - 64);
  }
  return { row: rowNumber, col };
};

export const evaluateFormula = (
  formula: string,
  grid: Cell[]
): number | string | void => {
  const functionName = formula.split("(")[0].toLowerCase();
  const cellReferences = parseFormula(formula);

  if (cellReferences.length === 0) return 0;

  const refs = cellReferences.map(cellReferenceToIndices);
  const minRow = Math.min(...refs.map((r) => r.row));
  const maxRow = Math.max(...refs.map((r) => r.row));
  const minCol = Math.min(...refs.map((r) => r.col));
  const maxCol = Math.max(...refs.map((r) => r.col));

  let result: number | string | void;

  switch (functionName) {
    case "sum":
      result = 0;
      for (let i = minRow; i <= maxRow; i++) {
        for (let j = minCol; j <= maxCol; j++) {
          const cell = grid.find((c) => c.row === i && c.col === j);
          if (cell && !isNaN(Number(cell.realValue))) {
            result += Number(cell.realValue);
          }
        }
      }
      break;

    case "average":
      let sum = 0;
      let count = 0;
      for (let i = minRow; i <= maxRow; i++) {
        for (let j = minCol; j <= maxCol; j++) {
          const cell = grid.find((c) => c.row === i && c.col === j);
          if (cell && !isNaN(Number(cell.realValue))) {
            sum += Number(cell.realValue);
            count++;
          }
        }
      }
      result = count > 0 ? sum / count : 0;
      break;

    case "min":
      result = Infinity;
      for (let i = minRow; i <= maxRow; i++) {
        for (let j = minCol; j <= maxCol; j++) {
          const cell = grid.find((c) => c.row === i && c.col === j);
          if (cell && !isNaN(Number(cell.realValue))) {
            result = Math.min(result as number, Number(cell.realValue));
          }
        }
      }
      result = result !== Infinity ? result : 0;
      break;

    case "max":
      result = -Infinity;
      for (let i = minRow; i <= maxRow; i++) {
        for (let j = minCol; j <= maxCol; j++) {
          const cell = grid.find((c) => c.row === i && c.col === j);
          if (cell && !isNaN(Number(cell.realValue))) {
            result = Math.max(result as number, Number(cell.realValue));
          }
        }
      }
      result = result !== -Infinity ? result : 0;
      break;

    default:
      result = formula;
      break;
  }

  return result;
};
