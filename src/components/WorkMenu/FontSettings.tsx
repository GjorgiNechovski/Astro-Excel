import React from "react";
import { state } from "../../state/stateManager";
import type { ICellStyle, TextAlign } from "../../models/cell";
import { fontSizes } from "../../assets/contants";

const FontSettings: React.FC = () => {
  const updateStyles = (
    property: keyof ICellStyle,
    value: string | boolean | TextAlign
  ) => {
    if (state.selectedCells.length > 0) {
      const updatedGrid = [...state.grid];

      updatedGrid.forEach((cell) => {
        if (
          state.selectedCells.some(
            (selected) => selected.row === cell.row && selected.col === cell.col
          )
        ) {
          if (!cell.styles) {
            cell.styles = {} as ICellStyle;
          }

          if (property === "textAlign") {
            cell.styles[property] = value as TextAlign;
          } else {
            cell.styles[property] = value as string;
          }
        }
      });

      state.setGrid(updatedGrid);
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateStyles("fontSize", e.target.value + "px");
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateStyles("fontFamily", e.target.value);
  };

  const handleBoldClick = () => {
    updateStyles("fontWeight", "bold");
  };

  const handleItalicClick = () => {
    updateStyles("fontStyle", "italic");
  };

  const handleUnderlineClick = () => {
    updateStyles("textDecoration", "underline");
  };

  return (
    <div>
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
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Verdana">Verdana</option>
          <option value="Georgia">Georgia</option>
        </select>
      </span>
      <span>
        <button onClick={handleBoldClick} title="Bold">
          <strong>B</strong>
        </button>
        <button onClick={handleItalicClick} title="Italic">
          <em>I</em>
        </button>
        <button onClick={handleUnderlineClick} title="Underline">
          <u>U</u>
        </button>
      </span>
    </div>
  );
};

export default FontSettings;
