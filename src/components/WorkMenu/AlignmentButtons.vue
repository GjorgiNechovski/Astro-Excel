<template>
  <div class="alignment-buttons">
    <button @click="alignLeft">Left</button>
    <button @click="alignCenter">Center</button>
    <button @click="alignRight">Right</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { state } from "../../state/stateManager";
import { Cell, type TextAlign, type ICellStyle } from "../../models/cell";

export default defineComponent({
  name: "AlignmentButtons",
  setup() {
    const updateAlignment = (alignment: TextAlign) => {
      if (state.selectedCells.length > 0) {
        const updatedGrid = state.grid.map((cell: Cell) => {
          if (
            state.selectedCells.some(
              (selected) =>
                selected.row === cell.row && selected.col === cell.col
            )
          ) {
            const { textAlign, ...restStyles } = cell.styles || {};
            return new Cell(
              cell.realValue,
              cell.displayValue,
              cell.row,
              cell.col,
              cell.disabled,
              {
                ...restStyles,
                textAlign: alignment,
              } as ICellStyle
            );
          }
          return cell;
        }) as Cell[];
        state.setGrid(updatedGrid);
      }
    };

    const alignLeft = () => updateAlignment("left");
    const alignCenter = () => updateAlignment("center");
    const alignRight = () => updateAlignment("right");

    return {
      alignLeft,
      alignCenter,
      alignRight,
    };
  },
});
</script>

<style scoped>
.alignment-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

button {
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
}

button:hover {
  background-color: #e0e0e0;
}
</style>
