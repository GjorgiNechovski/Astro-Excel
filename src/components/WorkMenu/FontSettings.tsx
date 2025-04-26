import React from 'react';
import { state } from '../../state/stateManager';
import type { ICellStyle } from '../../models/cell';
import { fontSizes } from '../../models/contants';
import '../../styles/font-settings.css';

const FontSettings: React.FC = () => {
  const toggleStyleProperty = (
    property: keyof ICellStyle,
    value: string,
    defaultValue: string,
  ) => {
    if (state.selectedCells.length === 0) return;

    const selectedCells = state.grid.filter((cell) =>
      state.selectedCells.some(
        (selected) => selected.row === cell.row && selected.col === cell.col,
      ),
    );

    const allHaveStyle = selectedCells.every(
      (cell) => cell.styles?.[property] === value,
    );

    const updatedGrid = [...state.grid].map((cell) => {
      if (
        state.selectedCells.some(
          (selected) => selected.row === cell.row && selected.col === cell.col,
        )
      ) {
        if (!cell.styles) {
          cell.styles = {} as ICellStyle;
        }
        //@ts-ignore
        cell.styles[property] = allHaveStyle ? defaultValue : value;
      }
      return cell;
    });

    state.setGrid(updatedGrid);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (state.selectedCells.length > 0) {
      const updatedGrid = [...state.grid].map((cell) => {
        if (
          state.selectedCells.some(
            (selected) =>
              selected.row === cell.row && selected.col === cell.col,
          )
        ) {
          if (!cell.styles) {
            cell.styles = {} as ICellStyle;
          }
          cell.styles.fontSize = e.target.value + 'px';
        }
        return cell;
      });
      state.setGrid(updatedGrid);
    }
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (state.selectedCells.length > 0) {
      const updatedGrid = [...state.grid].map((cell) => {
        if (
          state.selectedCells.some(
            (selected) =>
              selected.row === cell.row && selected.col === cell.col,
          )
        ) {
          if (!cell.styles) {
            cell.styles = {} as ICellStyle;
          }
          cell.styles.fontFamily = e.target.value;
        }
        return cell;
      });
      state.setGrid(updatedGrid);
    }
  };

  const handleBoldClick = () => {
    toggleStyleProperty('fontWeight', 'bold', 'normal');
  };

  const handleItalicClick = () => {
    toggleStyleProperty('fontStyle', 'italic', 'normal');
  };

  const handleUnderlineClick = () => {
    toggleStyleProperty('textDecoration', 'underline', 'none');
  };

  return (
    <div className='font-settings'>
      <span>
        <label>Font Size:</label>
        <select onChange={handleFontSizeChange}>
          {fontSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </span>
      <span>
        <label>Font Family:</label>
        <select onChange={handleFontFamilyChange}>
          <option value='Arial'>Arial</option>
          <option value='Times New Roman'>Times New Roman</option>
          <option value='Courier New'>Courier New</option>
          <option value='Verdana'>Verdana</option>
          <option value='Georgia'>Georgia</option>
        </select>
      </span>
      <span>
        <button onClick={handleBoldClick} title='Bold'>
          <strong>B</strong>
        </button>
        <button onClick={handleItalicClick} title='Italic'>
          <em>I</em>
        </button>
        <button onClick={handleUnderlineClick} title='Underline'>
          <u>U</u>
        </button>
      </span>
    </div>
  );
};

export default FontSettings;
