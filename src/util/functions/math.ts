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
  col -= 1;

  return { row: rowNumber - 1, col };
};

export const evaluateFormula = (
  formula: string,
  grid: Cell[]
): number | string | void => {
  const cellReferences = parseFormula(formula);

  if (formula.startsWith("sum(")) {
    let sum = 0;
    for (const ref of cellReferences) {
      const { row, col } = cellReferenceToIndices(ref);
      const cell = grid.find((c) => c.row === row && c.col === col);
      if (cell && !isNaN(Number(cell.realValue))) {
        sum += Number(cell.realValue);
      }
    }
    return sum;
  }

  if (formula.startsWith("average(")) {
    let sum = 0;
    let count = 0;
    for (const ref of cellReferences) {
      const { row, col } = cellReferenceToIndices(ref);
      const cell = grid.find((c) => c.row === row && c.col === col);
      if (cell && !isNaN(Number(cell.realValue))) {
        sum += Number(cell.realValue);
        count++;
      }
    }
    return count > 0 ? sum / count : 0;
  }

  if (formula.startsWith("min(")) {
    let min = Infinity;
    for (const ref of cellReferences) {
      const { row, col } = cellReferenceToIndices(ref);
      const cell = grid.find((c) => c.row === row && c.col === col);
      if (cell && !isNaN(Number(cell.realValue))) {
        min = Math.min(min, Number(cell.realValue));
      }
    }
    return min !== Infinity ? min : 0;
  }

  if (formula.startsWith("max(")) {
    let max = -Infinity;
    for (const ref of cellReferences) {
      const { row, col } = cellReferenceToIndices(ref);
      const cell = grid.find((c) => c.row === row && c.col === col);
      if (cell && !isNaN(Number(cell.realValue))) {
        max = Math.max(max, Number(cell.realValue));
      }
    }
    return max !== -Infinity ? max : 0;
  }

  return formula;
};
