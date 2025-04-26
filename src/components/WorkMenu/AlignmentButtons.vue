<template>
  <div class="alignment-buttons">
    <button @click="alignLeft">Left</button>
    <button @click="alignCenter">Center</button>
    <button @click="alignRight">Right</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { state } from '../../state/stateManager';
import { Cell, type TextAlign, type ICellStyle } from '../../models/cell';
import '../../styles/alignment-buttons.css';

export default defineComponent({
  name: 'AlignmentButtons',
  setup() {
    const updateAlignment = (alignment: TextAlign) => {
      if (state.selectedCells.length > 0) {
        const updatedGrid = state.grid.map((cell: Cell) => {
          if (
            state.selectedCells.some(
              (selected) =>
                selected.row === cell.row && selected.col === cell.col,
            )
          ) {
            const { textAlign, ...restStyles } = cell.styles || {};
            return new Cell(
              cell.realValue,
              cell.displayValue,
              cell.row,
              cell.col,
              cell.disabled,
              undefined,
              {
                ...restStyles,
                textAlign: alignment,
              } as ICellStyle,
            );
          }
          return cell;
        }) as Cell[];
        state.setGrid(updatedGrid);
      }
    };

    const alignLeft = () => updateAlignment('left');
    const alignCenter = () => updateAlignment('center');
    const alignRight = () => updateAlignment('right');

    return {
      alignLeft,
      alignCenter,
      alignRight,
    };
  },
});
</script>
