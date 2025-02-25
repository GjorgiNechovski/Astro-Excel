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
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import { state } from "../state/stateManager";

export default defineComponent({
  name: "CellDetails",
  setup() {
    const highlightedCell = ref<{ row: number; col: number } | null>(null);
    const highlightedCellValue = ref<string>("");

    const updateHighlightedCell = () => {
      if (state.selectedCell) {
        const { row, col } = state.selectedCell;
        const cell = state.grid.find(
          (cell) => cell.row === row && cell.col === col
        );
        highlightedCell.value = state.selectedCell;
        highlightedCellValue.value = cell ? cell.data : "";
      } else {
        highlightedCell.value = null;
        highlightedCellValue.value = "";
      }
    };

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
      if (highlightedCell.value) {
        const { row, col } = highlightedCell.value;
        const updatedGrid = state.grid.map((cell) =>
          cell.row === row && cell.col === col
            ? { ...cell, data: newValue }
            : cell
        );
        state.setGrid(updatedGrid);
      }
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
