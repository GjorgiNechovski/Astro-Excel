import { Cell } from '../../models/cell';
import { cellHeight, cellWidth } from '../../models/contants';

export const createCell = (
  displayValue: string,
  realValue: string,
  row: number,
  col: number,
  isHeader: boolean,
): Cell => {
  return new Cell(displayValue, realValue, row, col, isHeader, undefined, {
    width: `${cellWidth}px`,
    height: `${cellHeight}px`,
    border: '1px solid black',
    padding: '0',
    textAlign: isHeader ? 'center' : 'start',
    backgroundColor: isHeader ? '#ff9563' : 'white',
  });
};
