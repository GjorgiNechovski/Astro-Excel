<template>
  <div>
    <input
      id="highlighted-cell"
      type="text"
      :value="highlightedCellValue"
      @input="handleInputChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from "vue";
import { state } from "../../state/stateManager";

export default defineComponent({
  name: "CellDetails",
  setup() {
    const highlightedCell = ref<{ row: number; col: number } | null>(null);
    const highlightedCellValue = ref<string>("");

    const updateHighlightedCell = () => {
      if (state.selectedCells.length > 0) {
        const { row, col } = state.selectedCells[0];
        const cell = state.grid.find(
          (cell) => cell.row === row && cell.col === col
        );
        highlightedCell.value = { row, col };
        highlightedCellValue.value = cell ? cell.displayValue : "";
      } else {
        highlightedCell.value = null;
        highlightedCellValue.value = "";
      }
    };

    watch(highlightedCellValue, (newValue) => {
      if (highlightedCell.value) {
        const { row, col } = highlightedCell.value;
        const updatedGrid = state.grid.map((cell) => {
          if (cell.row === row && cell.col === col) {
            if (newValue.startsWith("=")) {
              return {
                ...cell,
                displayValue: newValue,
                realValue: newValue,
              };
            } else {
              return { ...cell, displayValue: newValue, realValue: newValue };
            }
          }
          return cell;
        });
        state.setGrid(updatedGrid);
      }
    });

    onMounted(() => {
      state.subscribe(updateHighlightedCell);
      updateHighlightedCell();
    });

    onUnmounted(() => {
      state.listeners = state.listeners.filter(
        (listener) => listener !== updateHighlightedCell
      );
    });

    const handleInputChange = (event: Event) => {
      const newValue = (event.target as HTMLInputElement).value;
      highlightedCellValue.value = newValue;
    };

    return {
      highlightedCell,
      highlightedCellValue,
      handleInputChange,
    };
  },
});
</script>

<style scoped>
#highlighted-cell {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  margin-bottom: 10px;
}
</style>
