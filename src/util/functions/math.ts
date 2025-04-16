import type { Cell } from '../../models/cell';

const parseFormula = (formula: string): string[] => {
  const regex = /([A-Z]+\d+)/g;
  return formula.match(regex) || [];
};

export const cellReferenceToIndices = (
  ref: string,
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
  grid: Cell[],
  evaluatingCells: Set<string> = new Set(),
): number | string | void => {
  const functionName = formula.split('(')[0].toLowerCase();
  const cellReferences = parseFormula(formula);

  if (cellReferences.length === 0) return 0;

  const refs = cellReferences.map(cellReferenceToIndices);
  const minRow = Math.min(...refs.map((r) => r.row));
  const maxRow = Math.max(...refs.map((r) => r.row));
  const minCol = Math.min(...refs.map((r) => r.col));
  const maxCol = Math.max(...refs.map((r) => r.col));

  for (let i = minRow; i <= maxRow; i++) {
    for (let j = minCol; j <= maxCol; j++) {
      const cellKey = `${i}-${j}`;
      if (evaluatingCells.has(cellKey)) {
        return 'Circular reference detected';
      }
    }
  }

  let result: number | string | void;

  switch (functionName) {
    case 'sum':
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

    case 'average':
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

    case 'min':
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

    case 'max':
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

    case 'count':
      result = 0;
      for (let i = minRow; i <= maxRow; i++) {
        for (let j = minCol; j <= maxCol; j++) {
          const cell = grid.find((c) => c.row === i && c.col === j);
          if (cell && !isNaN(Number(cell.realValue)) && cell.realValue !== '') {
            result++;
          }
        }
      }
      break;

    case 'counta':
      result = 0;
      for (let i = minRow; i <= maxRow; i++) {
        for (let j = minCol; j <= maxCol; j++) {
          const cell = grid.find((c) => c.row === i && c.col === j);
          if (cell && cell.realValue !== '') {
            result++;
          }
        }
      }
      break;

    case 'product':
      result = 1;
      for (let i = minRow; i <= maxRow; i++) {
        for (let j = minCol; j <= maxCol; j++) {
          const cell = grid.find((c) => c.row === i && c.col === j);
          if (cell && !isNaN(Number(cell.realValue))) {
            result *= Number(cell.realValue);
          }
        }
      }
      break;

    case 'stdev':
      let values: number[] = [];
      for (let i = minRow; i <= maxRow; i++) {
        for (let j = minCol; j <= maxCol; j++) {
          const cell = grid.find((c) => c.row === i && c.col === j);
          if (cell && !isNaN(Number(cell.realValue))) {
            values.push(Number(cell.realValue));
          }
        }
      }
      if (values.length === 0) {
        result = 0;
        break;
      }
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance =
        values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
      result = Math.sqrt(variance);
      break;

    case 'median':
      let numbers: number[] = [];
      for (let i = minRow; i <= maxRow; i++) {
        for (let j = minCol; j <= maxCol; j++) {
          const cell = grid.find((c) => c.row === i && c.col === j);
          if (cell && !isNaN(Number(cell.realValue))) {
            numbers.push(Number(cell.realValue));
          }
        }
      }
      if (numbers.length === 0) {
        result = 0;
        break;
      }
      numbers.sort((a, b) => a - b);
      const mid = Math.floor(numbers.length / 2);
      result =
        numbers.length % 2 === 0
          ? (numbers[mid - 1] + numbers[mid]) / 2
          : numbers[mid];
      break;

    case 'if':
      const conditionMatch = formula.match(/IF\(([^,]+),([^,]+),(.+)\)/);
      if (!conditionMatch) {
        result = 'Invalid IF syntax';
        break;
      }
      const [_, condition, valueIfTrue, valueIfFalse] = conditionMatch;
      const [ref, operator, threshold] = condition.split(/([><=]+)/);
      const { row, col } = cellReferenceToIndices(ref.trim());
      const cellKey = `${row}-${col}`;
      if (evaluatingCells.has(cellKey)) {
        result = 'Circular reference detected';
        break;
      }
      evaluatingCells.add(cellKey);
      const cell = grid.find((c) => c.row === row && c.col === col);
      const cellValue = cell ? Number(cell.realValue) : 0;
      const threshNum = Number(threshold.trim());

      let isTrue: boolean;
      switch (operator) {
        case '>':
          isTrue = cellValue > threshNum;
          break;
        case '<':
          isTrue = cellValue < threshNum;
          break;
        case '=':
          isTrue = cellValue === threshNum;
          break;
        default:
          result = 'Invalid operator';
          return result;
      }
      result = isTrue ? valueIfTrue.trim() : valueIfFalse.trim();
      evaluatingCells.delete(cellKey);
      break;

    case 'concat':
      result = '';
      for (let i = minRow; i <= maxRow; i++) {
        for (let j = minCol; j <= maxCol; j++) {
          const cell = grid.find((c) => c.row === i && c.col === j);
          if (cell) {
            result += String(cell.realValue);
          }
        }
      }
      break;

    case 'power':
      const powerArgs = formula.match(/POWER\(([^,]+),([^)]+)\)/);
      if (!powerArgs || powerArgs.length < 3) {
        result = 'Invalid POWER syntax';
        break;
      }
      const baseRef = cellReferenceToIndices(powerArgs[1].trim());
      const expRef = cellReferenceToIndices(powerArgs[2].trim());
      const baseKey = `${baseRef.row}-${baseRef.col}`;
      const expKey = `${expRef.row}-${expRef.col}`;
      if (evaluatingCells.has(baseKey) || evaluatingCells.has(expKey)) {
        result = 'Circular reference detected';
        break;
      }
      evaluatingCells.add(baseKey);
      evaluatingCells.add(expKey);
      const baseCell = grid.find(
        (c) => c.row === baseRef.row && c.col === baseRef.col,
      );
      const expCell = grid.find(
        (c) => c.row === expRef.row && c.col === expRef.col,
      );
      const base = baseCell ? Number(baseCell.realValue) : 0;
      const exponent = expCell ? Number(expCell.realValue) : 0;
      result = Math.pow(base, exponent);
      evaluatingCells.delete(baseKey);
      evaluatingCells.delete(expKey);
      break;

    default:
      result = formula;
      break;
  }

  return result;
};
