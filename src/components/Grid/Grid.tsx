import { useEffect, useState, useRef } from 'react';
import { Cell } from '../../models/cell';
import { state } from '../../state/stateManager';
import { evaluateFormula } from '../../util/functions/math';
import ContextMenu from '../ContextMenu/ContextMenu';
import { useCellSelection } from '../../util/hooks/useCellSelection';
import { useGridResize } from '../../util/hooks/useGridResize';
import { useGridScroll } from '../../util/hooks/useGridScroll';
import { useGridState } from '../../util/hooks/useGridState';

interface GridProps {
  cells: Cell[];
}

export default function Grid({ cells: initialCells }: GridProps) {
  const getColumnLabel = (col: number): string => {
    let label = '';
    let tempCol = col - 1;
    do {
      label = String.fromCharCode(65 + (tempCol % 26)) + label;
      tempCol = Math.floor(tempCol / 26) - 1;
    } while (tempCol >= 0);
    return label;
  };

  const { grid, numRows, numCols, setGrid, setNumRows, setNumCols } =
    useGridState(initialCells);
  const {
    selectedCells,
    inputRefs,
    isCellSelected,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    onKeyDown,
    setSelectedCells,
  } = useCellSelection(grid, numRows);
  const { handleMouseDownOnBorder } = useGridResize(grid, (newGrid) => {
    setGrid(newGrid);
    state.setGrid(newGrid);
  });
  const { gridRef } = useGridScroll(
    numRows,
    numCols,
    grid,
    (newGrid) => {
      setGrid(newGrid);
      state.setGrid(newGrid);
    },
    setNumRows,
    setNumCols,
    getColumnLabel,
  );

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: number;
    value: string;
  } | null>(null);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const updatedGrid = grid.map((cell) => {
      if (cell.displayValue.endsWith('=')) {
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
  }, [grid, setGrid]);

  useEffect(() => {
    if (editingCell) {
      const inputKey = `${editingCell.row}-${editingCell.col}`;
      const inputElement = inputRefs.current[inputKey];
      if (inputElement) {
        inputElement.focus();
        inputElement.selectionStart = inputElement.selectionEnd =
          editingCell.value.length;
      }
    }
  }, [grid, editingCell, inputRefs]);

  const handleInputChange = (row: number, col: number, value: string) => {
    setEditingCell({ row, col, value });

    let updatedGrid;
    if (value.endsWith('=')) {
      const formula = value.slice(0, -1);
      updatedGrid = grid.map((cell) =>
        cell.row === row && cell.col === col
          ? { ...cell, displayValue: `${formula}=`, realValue: value }
          : cell,
      );
    } else {
      updatedGrid = grid.map((cell) =>
        cell.row === row && cell.col === col
          ? { ...cell, displayValue: value, realValue: value }
          : cell,
      );
    }

    setGrid(updatedGrid);
    state.setGrid(updatedGrid);
    setSelectedCells([{ row, col }]);
  };

  const handleInputBlur = (row: number, col: number) => {
    if (editingCell && editingCell.row === row && editingCell.col === col) {
      setEditingCell(null);
    }
  };

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
        <div key={i} style={{ display: 'flex', position: 'relative' }}>
          {rowCells.map((cell, index) => {
            const inputKey = `${cell.row}-${cell.col}`;
            let displayText = cell.realValue;
            if (
              cell.roundNumbers !== undefined &&
              cell.realValue !== '' &&
              !isNaN(Number(cell.realValue))
            ) {
              displayText = Number(cell.realValue).toFixed(cell.roundNumbers);
            }
            if (
              editingCell &&
              editingCell.row === cell.row &&
              editingCell.col === cell.col
            ) {
              displayText = editingCell.value;
            }

            return (
              <div key={index} style={{ position: 'relative' }}>
                <input
                  value={displayText}
                  style={{
                    width: cell.styles?.width || '100px',
                    height: cell.styles?.height || '30px',
                    border: cell.styles?.border || '1px solid #ccc',
                    padding: cell.styles?.padding || '2px',
                    textAlign: cell.styles?.textAlign || 'left',
                    backgroundColor: isCellSelected(cell.row, cell.col)
                      ? 'lightblue'
                      : cell.styles?.backgroundColor || 'white',
                    color: cell.styles?.color || 'black',
                    fontSize: cell.styles?.fontSize || '18px',
                    fontFamily: cell.styles?.fontFamily || 'Arial, sans-serif',
                    fontWeight: cell.styles?.fontWeight || 'normal',
                    fontStyle: cell.styles?.fontStyle || 'normal',
                    textDecoration: cell.styles?.textDecoration || 'none',
                  }}
                  disabled={cell.disabled}
                  onChange={(e) =>
                    handleInputChange(cell.row, cell.col, e.target.value)
                  }
                  onBlur={() => handleInputBlur(cell.row, cell.col)}
                  onKeyDown={(e) =>
                    onKeyDown(e, cell.row, cell.col, (newCell) => {
                      if (newCell.row >= numRows - 1) {
                        const newCells: Cell[] = [];
                        const newRowStart = numRows;
                        const newRowEnd = newRowStart + 10;
                        for (let i = newRowStart; i < newRowEnd; i++) {
                          for (let j = 0; j < numCols; j++) {
                            const isHeader = j === 0;
                            const value = isHeader ? i.toString() : '';
                            newCells.push({
                              row: i,
                              col: j,
                              displayValue: value,
                              realValue: value,
                              disabled: isHeader,
                            });
                          }
                        }
                        setNumRows(newRowEnd);
                        setGrid([...grid, ...newCells]);
                        state.setGrid([...grid, ...newCells]);
                      }
                      if (newCell.col >= numCols - 1) {
                        const newCells: Cell[] = [];
                        const newColStart = numCols;
                        const newColEnd = newColStart + 10;
                        for (let j = newColStart; j < newColEnd; j++) {
                          for (let i = 0; i < numRows; i++) {
                            const isHeader = i === 0;
                            const value = isHeader ? getColumnLabel(j) : '';
                            newCells.push({
                              row: i,
                              col: j,
                              displayValue: value,
                              realValue: value,
                              disabled: isHeader,
                            });
                          }
                        }
                        setNumCols(newColEnd);
                        setGrid([...grid, ...newCells]);
                        state.setGrid([...grid, ...newCells]);
                      }
                    })
                  }
                  onMouseDown={(e) => onMouseDown(cell.row, cell.col, e)}
                  onMouseEnter={() => onMouseEnter(cell.row, cell.col)}
                  onMouseUp={onMouseUp}
                  ref={(el) => {
                    inputRefs.current[inputKey] = el;
                  }}
                />
                {index < rowCells.length - 1 && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: '5px',
                      cursor: 'col-resize',
                      backgroundColor: 'transparent',
                    }}
                    onMouseDown={(e) =>
                      handleMouseDownOnBorder('col', cell.col, e)
                    }
                  />
                )}
              </div>
            );
          })}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '5px',
              cursor: 'row-resize',
              backgroundColor: 'transparent',
            }}
            onMouseDown={(e) => handleMouseDownOnBorder('row', i, e)}
          />
        </div>,
      );
    }
    return rowsArray;
  };

  return (
    <div
      ref={gridRef}
      style={{ overflow: 'auto', height: '100%', width: '100%' }}
      onMouseUp={onMouseUp}
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
                (sel) => sel.row === cell.row && sel.col === cell.col,
              )
                ? { ...cell, roundNumbers: decimals }
                : cell,
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
