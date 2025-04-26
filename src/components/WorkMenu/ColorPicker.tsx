import React from 'react';
import { state } from '../../state/stateManager';
import type { ICellStyle, TextAlign } from '../../models/cell';
import '../../styles/color-picker.css';

const ColorPickers: React.FC = () => {
  const updateStyles = (property: keyof ICellStyle, value: string) => {
    if (state.selectedCells.length > 0) {
      const updatedGrid = [...state.grid];

      updatedGrid.forEach((cell) => {
        if (
          state.selectedCells.some(
            (selected) =>
              selected.row === cell.row && selected.col === cell.col,
          )
        ) {
          if (!cell.styles) {
            cell.styles = {} as ICellStyle;
          }

          if (property === 'textAlign') {
            cell.styles[property] = value as TextAlign;
          } else {
            cell.styles[property] = value;
          }
        }
      });

      state.setGrid(updatedGrid);
    }
  };

  const handleBackgroundColorChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    updateStyles('backgroundColor', e.target.value);
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateStyles('color', e.target.value);
  };

  return (
    <div className='color-pickers'>
      <span>
        <label>Background Color:</label>
        <input
          id='background-color-picker'
          type='color'
          onChange={handleBackgroundColorChange}
        />
      </span>
      <span>
        <label>Text Color:</label>
        <input
          id='text-color-picker'
          type='color'
          onChange={handleTextColorChange}
        />
      </span>
    </div>
  );
};

export default ColorPickers;
